
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { styleFeature, onEachFeature } from './mapUtils';

interface GeoJSONLayerProps {
  geoJSON: any;
  visualizationType?: 'standard' | 'choropleth' | 'heatmap';
  category?: string;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ 
  geoJSON, 
  visualizationType = 'standard',
  category
}) => {
  if (!geoJSON) return null;
  
  // Create props object that matches expected types for GeoJSON component
  const geoJSONProps = {
    data: geoJSON,
    // Use a function wrapper for style to ensure correct typing
    style: (feature: any) => styleFeature(feature, visualizationType, category),
    onEachFeature: onEachFeature
  };
  
  return <GeoJSON {...geoJSONProps} />;
};

export default GeoJSONLayer;
