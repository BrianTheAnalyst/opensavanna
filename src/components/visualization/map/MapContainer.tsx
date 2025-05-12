
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import GeoJSONLayer from './GeoJSONLayer';
import PointMarkers from './PointMarkers';

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
}

const MapContainerComponent: React.FC<MapContainerComponentProps> = ({
  center,
  zoom,
  geoJSON,
  points = []
}) => {
  // Define props for Leaflet components
  const mapContainerProps = {
    style: { height: '100%', width: '100%' },
    center,
    zoom,
  };

  const tileLayerProps = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  };

  return (
    // @ts-ignore - Type definitions for react-leaflet don't match exactly
    <LeafletMapContainer {...mapContainerProps}>
      {/* @ts-ignore */}
      <TileLayer {...tileLayerProps} />
      
      {/* GeoJSON layer */}
      {geoJSON && <GeoJSONLayer geoJSON={geoJSON} />}
      
      {/* Point markers */}
      {points.length > 0 && <PointMarkers points={points} />}
    </LeafletMapContainer>
  );
};

export default MapContainerComponent;
