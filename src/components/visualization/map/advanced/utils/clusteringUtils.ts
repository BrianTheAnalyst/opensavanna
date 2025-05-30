
import { MapPoint } from '../types';

/**
 * DBSCAN clustering algorithm implementation
 */
export const performDBSCANClustering = (
  points: MapPoint[], 
  radiusKm: number, 
  minPoints: number
) => {
  const clusteredPoints = [...points];
  const clusters: Array<{
    id: number;
    center: [number, number];
    points: MapPoint[];
    avgValue: number;
    variance: number;
  }> = [];
  
  let clusterIndex = 0;
  const visited = new Set<string>();
  
  // Initialize all points as unassigned
  clusteredPoints.forEach(point => {
    point.cluster = -1; // -1 indicates noise/unassigned
  });
  
  for (const point of clusteredPoints) {
    if (visited.has(point.id)) continue;
    
    visited.add(point.id);
    const neighbors = getNeighbors(point, clusteredPoints, radiusKm);
    
    if (neighbors.length < minPoints) {
      // Mark as noise
      point.cluster = -1;
    } else {
      // Start new cluster
      const clusterPoints = expandCluster(
        point, 
        neighbors, 
        clusteredPoints, 
        radiusKm, 
        minPoints, 
        visited, 
        clusterIndex
      );
      
      if (clusterPoints.length > 0) {
        // Calculate cluster statistics
        const avgLat = clusterPoints.reduce((sum, p) => sum + p.lat, 0) / clusterPoints.length;
        const avgLng = clusterPoints.reduce((sum, p) => sum + p.lng, 0) / clusterPoints.length;
        const avgValue = clusterPoints.reduce((sum, p) => sum + p.value, 0) / clusterPoints.length;
        const variance = clusterPoints.reduce((sum, p) => 
          sum + Math.pow(p.value - avgValue, 2), 0
        ) / clusterPoints.length;
        
        clusters.push({
          id: clusterIndex,
          center: [avgLat, avgLng],
          points: clusterPoints,
          avgValue,
          variance
        });
        
        clusterIndex++;
      }
    }
  }
  
  return {
    points: clusteredPoints,
    clusters,
    noisePoints: clusteredPoints.filter(p => p.cluster === -1)
  };
};

/**
 * Get neighbors within specified radius
 */
const getNeighbors = (point: MapPoint, allPoints: MapPoint[], radiusKm: number): MapPoint[] => {
  return allPoints.filter(p => {
    if (p.id === point.id) return false;
    const distance = haversineDistance(point.lat, point.lng, p.lat, p.lng);
    return distance <= radiusKm;
  });
};

/**
 * Expand cluster using DBSCAN algorithm
 */
const expandCluster = (
  point: MapPoint,
  neighbors: MapPoint[],
  allPoints: MapPoint[],
  radiusKm: number,
  minPoints: number,
  visited: Set<string>,
  clusterIndex: number
): MapPoint[] => {
  const cluster: MapPoint[] = [];
  
  // Add starting point to cluster
  point.cluster = clusterIndex;
  cluster.push(point);
  
  // Process each neighbor
  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    
    if (!visited.has(neighbor.id)) {
      visited.add(neighbor.id);
      const neighborNeighbors = getNeighbors(neighbor, allPoints, radiusKm);
      
      // If neighbor has enough neighbors, add them to the search list
      if (neighborNeighbors.length >= minPoints) {
        neighbors.push(...neighborNeighbors.filter(nn => 
          !neighbors.some(existing => existing.id === nn.id)
        ));
      }
    }
    
    // If neighbor is not yet assigned to a cluster, add it to this one
    if (neighbor.cluster === -1) {
      neighbor.cluster = clusterIndex;
      cluster.push(neighbor);
    }
  }
  
  return cluster;
};

/**
 * Calculate density for each point
 */
export const calculatePointDensity = (points: MapPoint[], radiusKm: number): MapPoint[] => {
  return points.map(point => {
    const neighbors = getNeighbors(point, points, radiusKm);
    const density = neighbors.length / (Math.PI * radiusKm * radiusKm); // points per km²
    
    return {
      ...point,
      density
    };
  });
};

/**
 * Haversine distance calculation
 */
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * K-means clustering alternative
 */
export const performKMeansClustering = (points: MapPoint[], k: number, maxIterations: number = 100) => {
  if (points.length < k) return { points, clusters: [] };
  
  // Initialize centroids randomly
  let centroids = initializeRandomCentroids(points, k);
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign points to nearest centroid
    const assignments = points.map(point => {
      let minDistance = Infinity;
      let assignedCluster = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = haversineDistance(point.lat, point.lng, centroid.lat, centroid.lng);
        if (distance < minDistance) {
          minDistance = distance;
          assignedCluster = index;
        }
      });
      
      return { ...point, cluster: assignedCluster };
    });
    
    // Update centroids
    const newCentroids = centroids.map((_, clusterIndex) => {
      const clusterPoints = assignments.filter(p => p.cluster === clusterIndex);
      if (clusterPoints.length === 0) return centroids[clusterIndex];
      
      const avgLat = clusterPoints.reduce((sum, p) => sum + p.lat, 0) / clusterPoints.length;
      const avgLng = clusterPoints.reduce((sum, p) => sum + p.lng, 0) / clusterPoints.length;
      const avgValue = clusterPoints.reduce((sum, p) => sum + p.value, 0) / clusterPoints.length;
      
      return { lat: avgLat, lng: avgLng, value: avgValue };
    });
    
    // Check for convergence
    const convergence = centroids.every((centroid, index) => {
      const distance = haversineDistance(
        centroid.lat, centroid.lng, 
        newCentroids[index].lat, newCentroids[index].lng
      );
      return distance < 0.1; // 100m threshold
    });
    
    centroids = newCentroids;
    
    if (convergence) break;
  }
  
  // Create final cluster structure
  const clusters = centroids.map((centroid, index) => {
    const clusterPoints = points.filter((_, pointIndex) => {
      let minDistance = Infinity;
      let assignedCluster = 0;
      
      centroids.forEach((c, cIndex) => {
        const distance = haversineDistance(points[pointIndex].lat, points[pointIndex].lng, c.lat, c.lng);
        if (distance < minDistance) {
          minDistance = distance;
          assignedCluster = cIndex;
        }
      });
      
      return assignedCluster === index;
    });
    
    const avgValue = clusterPoints.reduce((sum, p) => sum + p.value, 0) / clusterPoints.length;
    const variance = clusterPoints.reduce((sum, p) => 
      sum + Math.pow(p.value - avgValue, 2), 0
    ) / clusterPoints.length;
    
    return {
      id: index,
      center: [centroid.lat, centroid.lng] as [number, number],
      points: clusterPoints,
      avgValue,
      variance
    };
  });
  
  return { points, clusters };
};

/**
 * Initialize random centroids for K-means
 */
const initializeRandomCentroids = (points: MapPoint[], k: number) => {
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, k);
};
