
import { MapPoint } from '../types';

export interface ClusterResult {
  points: MapPoint[];
  clusters: Array<{
    id: string;
    center: [number, number];
    points: MapPoint[];
    avgValue: number;
    variance: number;
  }>;
  noise: MapPoint[];
}

/**
 * Perform DBSCAN clustering on map points
 */
export const performDBSCANClustering = (
  points: MapPoint[],
  eps: number = 50, // Distance threshold in km
  minPts: number = 3
): ClusterResult => {
  if (points.length === 0) {
    return { points: [], clusters: [], noise: [] };
  }

  const visited = new Set<string>();
  const clustered = new Set<string>();
  const clusters: Array<{
    id: string;
    center: [number, number];
    points: MapPoint[];
    avgValue: number;
    variance: number;
  }> = [];
  const noise: MapPoint[] = [];
  let clusterId = 0;

  // Create a copy of points with cluster assignment
  const processedPoints: MapPoint[] = points.map(p => ({ ...p, cluster: -1 }));

  for (const point of processedPoints) {
    if (visited.has(point.id)) continue;
    
    visited.add(point.id);
    const neighbors = regionQuery(point, processedPoints, eps);
    
    if (neighbors.length < minPts) {
      noise.push(point);
      continue;
    }
    
    // Create new cluster
    const clusterPoints: MapPoint[] = [];
    expandCluster(point, neighbors, clusterId, visited, clustered, processedPoints, eps, minPts, clusterPoints);
    
    if (clusterPoints.length > 0) {
      const center = calculateClusterCenter(clusterPoints);
      const avgValue = clusterPoints.reduce((sum, p) => sum + p.value, 0) / clusterPoints.length;
      const variance = calculateVariance(clusterPoints.map(p => p.value), avgValue);
      
      clusters.push({
        id: clusterId.toString(),
        center,
        points: clusterPoints,
        avgValue,
        variance
      });
      
      clusterId++;
    }
  }

  return {
    points: processedPoints,
    clusters,
    noise
  };
};

/**
 * Find all points within eps distance of the query point
 */
const regionQuery = (queryPoint: MapPoint, points: MapPoint[], eps: number): MapPoint[] => {
  const neighbors: MapPoint[] = [];
  
  for (const point of points) {
    if (point.id !== queryPoint.id) {
      const distance = haversineDistance(
        queryPoint.lat, queryPoint.lng,
        point.lat, point.lng
      );
      
      if (distance <= eps) {
        neighbors.push(point);
      }
    }
  }
  
  return neighbors;
};

/**
 * Expand cluster using DBSCAN algorithm
 */
const expandCluster = (
  point: MapPoint,
  neighbors: MapPoint[],
  clusterId: number,
  visited: Set<string>,
  clustered: Set<string>,
  points: MapPoint[],
  eps: number,
  minPts: number,
  clusterPoints: MapPoint[]
): void => {
  point.cluster = clusterId;
  clustered.add(point.id);
  clusterPoints.push(point);
  
  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    
    if (!visited.has(neighbor.id)) {
      visited.add(neighbor.id);
      const neighborNeighbors = regionQuery(neighbor, points, eps);
      
      if (neighborNeighbors.length >= minPts) {
        neighbors.push(...neighborNeighbors);
      }
    }
    
    if (!clustered.has(neighbor.id)) {
      neighbor.cluster = clusterId;
      clustered.add(neighbor.id);
      clusterPoints.push(neighbor);
    }
  }
};

/**
 * Calculate the geometric center of a cluster
 */
const calculateClusterCenter = (points: MapPoint[]): [number, number] => {
  const sumLat = points.reduce((sum, p) => sum + p.lat, 0);
  const sumLng = points.reduce((sum, p) => sum + p.lng, 0);
  
  return [sumLat / points.length, sumLng / points.length];
};

/**
 * Calculate variance of values
 */
const calculateVariance = (values: number[], mean: number): number => {
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
};

/**
 * Calculate Haversine distance between two points in kilometers
 */
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * K-means clustering implementation
 */
export const performKMeansClustering = (
  points: MapPoint[],
  k: number = 5,
  maxIterations: number = 100
): ClusterResult => {
  if (points.length === 0 || k <= 0) {
    return { points: [], clusters: [], noise: [] };
  }

  // Initialize centroids randomly
  const centroids: [number, number][] = [];
  for (let i = 0; i < k; i++) {
    const randomPoint = points[Math.floor(Math.random() * points.length)];
    centroids.push([randomPoint.lat, randomPoint.lng]);
  }

  let iterations = 0;
  let converged = false;
  const processedPoints: MapPoint[] = points.map(p => ({ ...p, cluster: -1 }));

  while (!converged && iterations < maxIterations) {
    // Assign points to nearest centroid
    for (const point of processedPoints) {
      let minDistance = Infinity;
      let nearestCluster = -1;

      for (let i = 0; i < centroids.length; i++) {
        const distance = haversineDistance(
          point.lat, point.lng,
          centroids[i][0], centroids[i][1]
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestCluster = i;
        }
      }

      point.cluster = nearestCluster;
    }

    // Update centroids
    const newCentroids: [number, number][] = [];
    converged = true;

    for (let i = 0; i < k; i++) {
      const clusterPoints = processedPoints.filter(p => p.cluster === i);

      if (clusterPoints.length > 0) {
        const newCentroid = calculateClusterCenter(clusterPoints);
        newCentroids.push(newCentroid);

        // Check for convergence
        const distance = haversineDistance(
          centroids[i][0], centroids[i][1],
          newCentroid[0], newCentroid[1]
        );

        if (distance > 0.001) { // 1 meter threshold
          converged = false;
        }
      } else {
        newCentroids.push(centroids[i]);
      }
    }

    centroids.splice(0, centroids.length, ...newCentroids);
    iterations++;
  }

  // Build cluster results
  const clusters = [];
  for (let i = 0; i < k; i++) {
    const clusterPoints = processedPoints.filter(p => p.cluster === i);
    
    if (clusterPoints.length > 0) {
      const avgValue = clusterPoints.reduce((sum, p) => sum + p.value, 0) / clusterPoints.length;
      const variance = calculateVariance(clusterPoints.map(p => p.value), avgValue);

      clusters.push({
        id: i.toString(),
        center: centroids[i],
        points: clusterPoints,
        avgValue,
        variance
      });
    }
  }

  return {
    points: processedPoints,
    clusters,
    noise: []
  };
};
