
import { MapPoint } from '../types';

/**
 * Detect anomalies in geographic point data using z-scores
 * 
 * @param points Array of map points with values
 * @param threshold Z-score threshold for anomaly detection (default: 2.0)
 * @returns Array of map points with isAnomaly and zScore properties added
 */
export const detectAnomalies = (points: MapPoint[], threshold: number = 2.0): MapPoint[] => {
  if (!points || points.length === 0) return points;
  
  // Only consider points with numeric values
  const validPoints = points.filter(point => 
    typeof point.value === 'number' && !isNaN(point.value)
  );
  
  if (validPoints.length === 0) return points;
  
  // Calculate mean and standard deviation of values
  const values = validPoints.map(p => p.value as number);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate variance and standard deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // If standard deviation is too small, no anomalies
  if (stdDev < 0.0001) return points;
  
  // Calculate z-score for each point and mark anomalies
  return points.map(point => {
    if (typeof point.value === 'number') {
      const zScore = (point.value - mean) / stdDev;
      const isAnomaly = Math.abs(zScore) > threshold;
      
      return {
        ...point,
        isAnomaly,
        zScore
      };
    }
    return point;
  });
};

/**
 * Detect anomalies in GeoJSON features
 * 
 * @param geoJSON GeoJSON object with features
 * @param propertyName Property name containing the value to analyze
 * @param threshold Z-score threshold for anomaly detection
 * @returns GeoJSON with isAnomaly and zScore properties added to features
 */
export const detectGeoJSONAnomalies = (
  geoJSON: any, 
  propertyName: string = 'value',
  threshold: number = 2.0
): any => {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) {
    return geoJSON;
  }
  
  // Extract values from features
  const values: number[] = [];
  geoJSON.features.forEach((feature: any) => {
    if (feature.properties && typeof feature.properties[propertyName] === 'number') {
      values.push(feature.properties[propertyName]);
    }
  });
  
  if (values.length === 0) return geoJSON;
  
  // Calculate mean and standard deviation
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // If standard deviation is too small, no anomalies
  if (stdDev < 0.0001) return geoJSON;
  
  // Calculate z-scores and mark anomalies
  const processedFeatures = geoJSON.features.map((feature: any) => {
    const newFeature = { ...feature };
    
    // Make sure properties exists
    if (!newFeature.properties) {
      newFeature.properties = {};
    }
    
    // Calculate z-score if the property exists and is a number
    if (typeof newFeature.properties[propertyName] === 'number') {
      const value = newFeature.properties[propertyName];
      const zScore = (value - mean) / stdDev;
      const isAnomaly = Math.abs(zScore) > threshold;
      
      newFeature.properties.zScore = zScore;
      newFeature.properties.isAnomaly = isAnomaly;
    }
    
    return newFeature;
  });
  
  return {
    ...geoJSON,
    features: processedFeatures
  };
};
