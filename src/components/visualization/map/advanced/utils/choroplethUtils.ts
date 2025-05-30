
import { ChoroplethData } from '../types';

interface ChoroplethOptions {
  binningMethod: 'quantile' | 'equal' | 'jenks';
  bins: number;
  smoothing: boolean;
  timeIndex: number;
}

/**
 * Calculate choropleth values for geographic features
 */
export const calculateChoroplethValues = (
  geoJSON: any,
  points: any[],
  options: ChoroplethOptions
): ChoroplethData[] => {
  if (!geoJSON?.features || !points.length) return [];
  
  const results: ChoroplethData[] = [];
  
  // Process each geographic feature
  geoJSON.features.forEach((feature: any) => {
    // Find points within this feature (simplified approach)
    const featurePoints = points.filter(point => 
      isPointInFeature(point, feature)
    );
    
    // Calculate aggregate value for this feature
    const value = featurePoints.length > 0 
      ? featurePoints.reduce((sum, p) => sum + p.value, 0) / featurePoints.length
      : 0;
    
    results.push({
      feature,
      value,
      normalizedValue: 0, // Will be calculated after all values are collected
      rank: 0, // Will be calculated after sorting
      isOutlier: false
    });
  });
  
  // Normalize values and calculate ranks
  const values = results.map(r => r.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  // Calculate normalized values and detect outliers
  results.forEach((result, index) => {
    result.normalizedValue = range > 0 ? (result.value - minValue) / range : 0;
    
    // Simple outlier detection using z-score
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const zScore = stdDev > 0 ? Math.abs((result.value - mean) / stdDev) : 0;
    result.isOutlier = zScore > 2;
  });
  
  // Sort by value and assign ranks
  const sortedResults = [...results].sort((a, b) => b.value - a.value);
  sortedResults.forEach((result, index) => {
    result.rank = index + 1;
  });
  
  return results;
};

/**
 * Simple point-in-polygon test (simplified)
 */
const isPointInFeature = (point: any, feature: any): boolean => {
  // This is a simplified implementation
  // In a real application, you'd use a proper point-in-polygon algorithm
  
  if (!feature.geometry || !feature.geometry.coordinates) return false;
  
  // For now, we'll use a simple bounding box check
  const bounds = getFeatureBounds(feature);
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  );
};

/**
 * Get bounding box of a feature
 */
const getFeatureBounds = (feature: any) => {
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  
  const processCoordinates = (coords: any[]) => {
    coords.forEach(coord => {
      if (Array.isArray(coord[0])) {
        processCoordinates(coord);
      } else {
        const [lng, lat] = coord;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      }
    });
  };
  
  if (feature.geometry.coordinates) {
    processCoordinates(feature.geometry.coordinates);
  }
  
  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng
  };
};
