
import { MapPoint } from '../types';

/**
 * Detects anomalies in point data using z-score method
 * @param points Array of map points with values
 * @param threshold Z-score threshold for anomaly detection (default: 2.0)
 * @returns Array of points with anomaly flags and z-scores
 */
export function detectAnomalies(points: MapPoint[], threshold: number = 2.0): MapPoint[] {
  if (!points || points.length === 0) return [];

  // Extract values for z-score calculation
  const values = points.map(p => typeof p.value === 'number' ? p.value : 0).filter(v => v !== undefined);
  
  if (values.length === 0) return points;
  
  // Calculate mean
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate standard deviation
  const squareDiffs = values.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  // If standard deviation is too small (near-constant data), return original points
  if (stdDev < 0.0001) return points;
  
  // Calculate z-scores and flag anomalies
  return points.map(point => {
    if (typeof point.value !== 'number') {
      return { ...point, isAnomaly: false, zScore: 0 };
    }
    
    const zScore = Math.abs((point.value - mean) / stdDev);
    const isAnomaly = zScore > threshold;
    
    return {
      ...point,
      isAnomaly,
      zScore
    };
  });
}

/**
 * Detects anomalies in GeoJSON feature properties
 * @param geoJSON GeoJSON data
 * @param propertyName Property name to analyze for anomalies
 * @param threshold Z-score threshold for anomaly detection
 * @returns Modified GeoJSON with anomaly flags
 */
export function detectGeoJSONAnomalies(geoJSON: any, propertyName: string = 'value', threshold: number = 2.0): any {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) {
    return geoJSON;
  }
  
  // Extract values for the specified property
  const values = geoJSON.features
    .map(f => f.properties && f.properties[propertyName])
    .filter(v => typeof v === 'number');
  
  if (values.length === 0) return geoJSON;
  
  // Calculate mean
  const mean = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
  
  // Calculate standard deviation
  const squareDiffs = values.map((value: number) => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff = squareDiffs.reduce((sum: number, val: number) => sum + val, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  // If standard deviation is too small (near-constant data), return original GeoJSON
  if (stdDev < 0.0001) return geoJSON;
  
  // Calculate z-scores and flag anomalies
  const modifiedFeatures = geoJSON.features.map((feature: any) => {
    const value = feature.properties && feature.properties[propertyName];
    
    if (typeof value !== 'number') {
      return feature;
    }
    
    const zScore = Math.abs((value - mean) / stdDev);
    const isAnomaly = zScore > threshold;
    
    // Add anomaly information to properties
    return {
      ...feature,
      properties: {
        ...feature.properties,
        isAnomaly,
        zScore
      }
    };
  });
  
  return {
    ...geoJSON,
    features: modifiedFeatures
  };
}
