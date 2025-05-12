
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import GeoJSONLayer from './GeoJSONLayer';
import PointMarkers from './PointMarkers';
import HeatmapLayer from './HeatmapLayer';

interface MapContainerComponentProps {
  center: LatLngExpression;
  zoom: number;
  geoJSON?: any;
  points?: {
    lat: number;
    lng: number;
    name?: string;
    value?: number;
  }[];
  visualizationType?: 'standard' | 'choropleth' | 'heatmap';
  category?: string;
}

const MapContainerComponent: React.FC<MapContainerComponentProps> = ({
  center,
  zoom,
  geoJSON,
  points = [],
  visualizationType = 'standard',
  category
}) => {
  // Define props for Leaflet components
  const mapContainerProps = {
    style: { height: '100%', width: '100%' },
    center,
    zoom,
    zoomControl: false,
  };

  // Choose the appropriate tile layer based on visualization type
  const getTileLayer = () => {
    switch (visualizationType) {
      case 'choropleth':
        // For choropleth, use a minimal light background
        return {
          url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };
      case 'heatmap':
        // For heatmap, use a dark background
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };
      default:
        // For standard, use the default OSM tiles
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        };
    }
  };

  const tileLayerProps = getTileLayer();

  return (
    <LeafletMapContainer {...mapContainerProps}>
      <TileLayer {...tileLayerProps} />
      <ZoomControl position="topright" />
      
      {/* GeoJSON layer */}
      {geoJSON && visualizationType !== 'heatmap' && 
        <GeoJSONLayer 
          geoJSON={geoJSON} 
          visualizationType={visualizationType} 
          category={category}
        />
      }
      
      {/* Heatmap layer */}
      {visualizationType === 'heatmap' && points.length > 0 && (
        <HeatmapLayer points={points} />
      )}
      
      {/* Point markers */}
      {visualizationType === 'standard' && points.length > 0 && (
        <PointMarkers points={points} />
      )}
    </LeafletMapContainer>
  );
};

export default MapContainerComponent;
