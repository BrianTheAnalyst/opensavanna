
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { styleFeature } from './utils/styleUtils';
import { onEachFeature } from './utils/interactionUtils';
import { detectGeoJSONAnomalies } from './utils/anomalyDetection';

interface GeoJSONLayerProps {
  geoJSON: any;
  visualizationType?: 'standard' | 'choropleth' | 'heatmap';
  category?: string;
  timeIndex?: number;
  anomalyDetection?: boolean;
  anomalyThreshold?: number;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ 
  geoJSON, 
  visualizationType = 'standard',
  category,
  timeIndex = 0,
  anomalyDetection = false,
  anomalyThreshold = 2.0
}) => {
  if (!geoJSON) return null;
  
  // Process GeoJSON for anomalies if enabled - enhanced with memoization for performance
  const processedGeoJSON = React.useMemo(() => {
    if (anomalyDetection) {
      console.log(`Processing GeoJSON anomalies with threshold: ${anomalyThreshold}`);
      return detectGeoJSONAnomalies(geoJSON, 'value', anomalyThreshold);
    }
    return geoJSON;
  }, [geoJSON, anomalyDetection, anomalyThreshold]);
  
  // Filter features by time index if temporal data exists - enhanced with better error handling
  const filteredGeoJSON = React.useMemo(() => {
    if (!processedGeoJSON.features || !Array.isArray(processedGeoJSON.features)) {
      console.warn("Invalid GeoJSON structure - missing features array");
      return processedGeoJSON;
    }
    
    // Check if features have time properties
    const hasTemporal = processedGeoJSON.features.some(feature => 
      feature.properties && 
      (feature.properties.timeIndex !== undefined || 
       feature.properties.year !== undefined || 
       feature.properties.date !== undefined || 
       feature.properties.timestamp !== undefined)
    );
    
    if (!hasTemporal) return processedGeoJSON;
    
    console.log(`Filtering GeoJSON by time index: ${timeIndex}`);
    
    // Filter features based on time with improved matching
    const filteredFeatures = processedGeoJSON.features.filter(feature => {
      if (!feature.properties) return true;
      
      // Match by different possible time properties
      if (feature.properties.timeIndex !== undefined) {
        return feature.properties.timeIndex === timeIndex;
      }
      if (feature.properties.year !== undefined) {
        if (Array.isArray(feature.properties.year)) {
          return feature.properties.year.includes(timeIndex);
        }
        // Handle year ranges like "2020-2022"
        if (typeof feature.properties.year === 'string' && feature.properties.year.includes('-')) {
          const [start, end] = feature.properties.year.split('-').map(Number);
          return timeIndex >= start && timeIndex <= end;
        }
        return feature.properties.year === timeIndex;
      }
      if (feature.properties.date !== undefined) {
        if (Array.isArray(feature.properties.date)) {
          return feature.properties.date.includes(timeIndex);
        }
        return feature.properties.date === timeIndex;
      }
      if (feature.properties.timestamp !== undefined) {
        // For timestamp-based data, you might need to convert timeIndex to a timestamp range
        // Simplified example - assumes timeIndex represents days and timestamps are in milliseconds
        const dayInMs = 86400000; // 24 hours in milliseconds
        const startTime = timeIndex * dayInMs;
        const endTime = (timeIndex + 1) * dayInMs;
        return feature.properties.timestamp >= startTime && feature.properties.timestamp < endTime;
      }
      
      return true;
    });
    
    return {
      ...processedGeoJSON,
      features: filteredFeatures
    };
  }, [processedGeoJSON, timeIndex]);
  
  // Create props object that matches expected types for GeoJSON component
  const geoJSONProps = {
    data: filteredGeoJSON,
    // Use a function wrapper for style to ensure correct typing
    style: (feature: any) => styleFeature(feature, visualizationType, category, anomalyDetection),
    onEachFeature: onEachFeature
  };
  
  return <GeoJSON {...geoJSONProps} />;
};

export default GeoJSONLayer;
