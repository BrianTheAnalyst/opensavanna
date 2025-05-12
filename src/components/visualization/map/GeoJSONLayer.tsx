
import React from 'react';
import { GeoJSON } from 'react-leaflet/GeoJSON';
import { styleFeature, onEachFeature } from './mapUtils';

interface GeoJSONLayerProps {
  geoJSON: any;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ geoJSON }) => {
  if (!geoJSON) return null;
  
  return (
    // @ts-ignore - Type definitions for react-leaflet don't match exactly
    <GeoJSON 
      data={geoJSON}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
};

export default GeoJSONLayer;
