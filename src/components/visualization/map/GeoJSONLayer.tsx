
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { styleFeature } from './utils/styleUtils';
import { onEachFeature } from './utils/interactionUtils';

interface GeoJSONLayerProps {
  geoJSON: any;
  visualizationType?: 'standard' | 'choropleth' | 'heatmap';
  category?: string;
  timeIndex?: number;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ 
  geoJSON, 
  visualizationType = 'standard',
  category,
  timeIndex = 0
}) => {
  if (!geoJSON) return null;
  
  // Filter features by time index if temporal data exists
  const filteredGeoJSON = React.useMemo(() => {
    if (!geoJSON.features || !Array.isArray(geoJSON.features)) return geoJSON;
    
    // Check if features have time properties
    const hasTemporal = geoJSON.features.some(feature => 
      feature.properties && 
      (feature.properties.timeIndex !== undefined || 
       feature.properties.year !== undefined || 
       feature.properties.date !== undefined)
    );
    
    if (!hasTemporal) return geoJSON;
    
    // Filter features based on time
    const filteredFeatures = geoJSON.features.filter(feature => {
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
      ...geoJSON,
      features: filteredFeatures
    };
  }, [geoJSON, timeIndex]);
  
  // Create props object that matches expected types for GeoJSON component
  const geoJSONProps = {
    data: filteredGeoJSON,
    // Use a function wrapper for style to ensure correct typing
    style: (feature: any) => styleFeature(feature, visualizationType, category),
    onEachFeature: onEachFeature
  };
  
  return <GeoJSON {...geoJSONProps} />;
};

export default GeoJSONLayer;
