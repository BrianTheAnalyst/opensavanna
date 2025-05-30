
import { MapPoint, DataPattern } from '../types';

/**
 * Detects patterns in geographic data
 */
export const detectDataPatterns = (points: MapPoint[]): DataPattern => {
  // Detect clusters using DBSCAN-like algorithm
  const clusters = detectClusters(points, 50, 3); // 50km radius, min 3 points
  
  // Detect outliers using statistical methods
  const outliers = detectStatisticalOutliers(points);
  
  // Check for temporal data
  const hasTemporalData = points.some(p => p.timeIndex !== undefined);
  const timeRange = hasTemporalData ? {
    min: Math.min(...points.map(p => p.timeIndex || 0)),
    max: Math.max(...points.map(p => p.timeIndex || 0))
  } : undefined;
  
  // Identify dominant geographic region
  const dominantRegion = identifyDominantRegion(points);
  
  // Calculate correlations between variables
  const correlations = calculateVariableCorrelations(points);
  
  return {
    clusters,
    outliers,
    hasTemporalData,
    timeRange,
    dominantRegion,
    correlations
  };
};

/**
 * DBSCAN-inspired clustering algorithm for geographic points
 */
const detectClusters = (points: MapPoint[], radiusKm: number, minPoints: number) => {
  const clusters: Array<{
    id: string;
    center: [number, number];
    points: MapPoint[];
    avgValue: number;
    variance: number;
  }> = [];
  
  const visited = new Set<string>();
  const clustered = new Set<string>();
  
  points.forEach((point, index) => {
    if (visited.has(point.id)) return;
    
    visited.add(point.id);
    const neighbors = getNeighbors(point, points, radiusKm);
    
    if (neighbors.length >= minPoints) {
      const clusterPoints = expandCluster(point, neighbors, points, radiusKm, minPoints, visited, clustered);
      
      if (clusterPoints.length > 0) {
        const avgLat = clusterPoints.reduce((sum, p) => sum + p.lat, 0) / clusterPoints.length;
        const avgLng = clusterPoints.reduce((sum, p) => sum + p.lng, 0) / clusterPoints.length;
        const avgValue = clusterPoints.reduce((sum, p) => sum + p.value, 0) / clusterPoints.length;
        const variance = clusterPoints.reduce((sum, p) => sum + Math.pow(p.value - avgValue, 2), 0) / clusterPoints.length;
        
        clusters.push({
          id: `cluster-${clusters.length}`,
          center: [avgLat, avgLng],
          points: clusterPoints,
          avgValue,
          variance
        });
      }
    }
  });
  
  return clusters;
};

/**
 * Get neighbors within radius
 */
const getNeighbors = (point: MapPoint, allPoints: MapPoint[], radiusKm: number): MapPoint[] => {
  return allPoints.filter(p => {
    if (p.id === point.id) return false;
    const distance = haversineDistance(point.lat, point.lng, p.lat, p.lng);
    return distance <= radiusKm;
  });
};

/**
 * Expand cluster using DBSCAN logic
 */
const expandCluster = (
  point: MapPoint, 
  neighbors: MapPoint[], 
  allPoints: MapPoint[], 
  radiusKm: number, 
  minPoints: number,
  visited: Set<string>,
  clustered: Set<string>
): MapPoint[] => {
  const cluster = [point];
  clustered.add(point.id);
  
  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    
    if (!visited.has(neighbor.id)) {
      visited.add(neighbor.id);
      const neighborNeighbors = getNeighbors(neighbor, allPoints, radiusKm);
      
      if (neighborNeighbors.length >= minPoints) {
        neighbors.push(...neighborNeighbors.filter(nn => !neighbors.some(n => n.id === nn.id)));
      }
    }
    
    if (!clustered.has(neighbor.id)) {
      cluster.push(neighbor);
      clustered.add(neighbor.id);
    }
  }
  
  return cluster;
};

/**
 * Detect statistical outliers using z-score
 */
const detectStatisticalOutliers = (points: MapPoint[], threshold: number = 2.5): MapPoint[] => {
  const values = points.map(p => p.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
  
  return points.filter(point => {
    const zScore = Math.abs(point.value - mean) / stdDev;
    return zScore > threshold;
  }).map(point => ({
    ...point,
    isAnomaly: true,
    zScore: Math.abs(point.value - mean) / stdDev
  }));
};

/**
 * Identify the dominant geographic region
 */
const identifyDominantRegion = (points: MapPoint[]): string => {
  // Group points by approximate regions
  const regions = {
    'Northern Hemisphere': points.filter(p => p.lat > 0).length,
    'Southern Hemisphere': points.filter(p => p.lat <= 0).length,
    'Eastern Hemisphere': points.filter(p => p.lng > 0).length,
    'Western Hemisphere': points.filter(p => p.lng <= 0).length
  };
  
  const maxRegion = Object.entries(regions).reduce((max, [region, count]) => 
    count > max.count ? { region, count } : max, 
    { region: '', count: 0 }
  );
  
  return maxRegion.region;
};

/**
 * Calculate correlations between variables in point properties
 */
const calculateVariableCorrelations = (points: MapPoint[]) => {
  const correlations: Array<{
    variable1: string;
    variable2: string;
    correlation: number;
    significance: number;
  }> = [];
  
  // Get all numeric properties
  const numericProps = new Set<string>();
  points.forEach(point => {
    if (point.properties) {
      Object.entries(point.properties).forEach(([key, value]) => {
        if (typeof value === 'number') {
          numericProps.add(key);
        }
      });
    }
  });
  
  const propArray = Array.from(numericProps);
  
  // Calculate pairwise correlations
  for (let i = 0; i < propArray.length; i++) {
    for (let j = i + 1; j < propArray.length; j++) {
      const prop1 = propArray[i];
      const prop2 = propArray[j];
      
      const values1 = points.map(p => p.properties?.[prop1] || 0).filter(v => typeof v === 'number');
      const values2 = points.map(p => p.properties?.[prop2] || 0).filter(v => typeof v === 'number');
      
      if (values1.length > 5 && values2.length > 5) {
        const correlation = pearsonCorrelation(values1, values2);
        const significance = Math.abs(correlation);
        
        if (significance > 0.3) { // Only include meaningful correlations
          correlations.push({
            variable1: prop1,
            variable2: prop2,
            correlation,
            significance
          });
        }
      }
    }
  }
  
  return correlations.sort((a, b) => b.significance - a.significance);
};

/**
 * Calculate Pearson correlation coefficient
 */
const pearsonCorrelation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  
  const sumX = x.slice(0, n).reduce((sum, val) => sum + val, 0);
  const sumY = y.slice(0, n).reduce((sum, val) => sum + val, 0);
  const sumXY = x.slice(0, n).reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.slice(0, n).reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
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
