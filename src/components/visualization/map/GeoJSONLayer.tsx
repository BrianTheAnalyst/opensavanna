
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { styleFeature, onEachFeature } from './mapUtils';

interface GeoJSONLayerProps {
  geoJSON: any;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ geoJSON }) => {
  if (!geoJSON) return null;
  
  // Create props object that matches expected types for GeoJSON component
  const geoJSONProps = {
    data: geoJSON,
    // Use a function wrapper for style to ensure correct typing
    pathOptions: styleFeature,
    onEachFeature: onEachFeature
  };
  
  return <GeoJSON {...geoJSONProps} />;
};

export default GeoJSONLayer;
