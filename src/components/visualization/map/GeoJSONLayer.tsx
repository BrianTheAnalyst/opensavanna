
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
  
  // Process GeoJSON for anomalies if enabled
  const processedGeoJSON = React.useMemo(() => {
    if (anomalyDetection) {
      return detectGeoJSONAnomalies(geoJSON, 'value', anomalyThreshold);
    }
    return geoJSON;
  }, [geoJSON, anomalyDetection, anomalyThreshold]);
  
  // Filter features by time index if temporal data exists
  const filteredGeoJSON = React.useMemo(() => {
    if (!processedGeoJSON.features || !Array.isArray(processedGeoJSON.features)) return processedGeoJSON;
    
    // Check if features have time properties
    const hasTemporal = processedGeoJSON.features.some(feature => 
      feature.properties && 
      (feature.properties.timeIndex !== undefined || 
       feature.properties.year !== undefined || 
       feature.properties.date !== undefined)
    );
    
    if (!hasTemporal) return processedGeoJSON;
    
    // Filter features based on time
    const filteredFeatures = processedGeoJSON.features.filter(feature => {
      if (!feature.properties) return true;
      
      // Match by different possible time properties
      if (feature.properties.timeIndex !== undefined) {
        return feature.properties.timeIndex === timeIndex;
      }
      if (feature.properties.year !== undefined && Array.isArray(feature.properties.year)) {
        return feature.properties.year.includes(timeIndex);
      }
      if (feature.properties.date !== undefined && Array.isArray(feature.properties.date)) {
        return feature.properties.date.includes(timeIndex);
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
