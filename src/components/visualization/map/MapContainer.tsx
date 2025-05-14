
import React, { useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl, LayersControl } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import GeoJSONLayer from './GeoJSONLayer';
import PointMarkers from './PointMarkers';
import HeatmapLayer from './HeatmapLayer';
import ClusterMarkers from './ClusterMarkers';

interface MapContainerComponentProps {
  center: LatLngExpression;
  zoom: number;
  geoJSON?: any;
  points?: {
    lat: number;
    lng: number;
    name?: string;
    value?: number;
    timeIndex?: number;
  }[];
  visualizationType?: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  category?: string;
  currentTimeIndex?: number;
  activeLayers?: string[];
}

const MapContainerComponent: React.FC<MapContainerComponentProps> = ({
  center,
  zoom,
  geoJSON,
  points = [],
  visualizationType = 'standard',
  category,
  currentTimeIndex = 0,
  activeLayers = ['base', 'data']
}) => {
  // Define props for Leaflet components
  const mapContainerProps = {
    style: { height: '100%', width: '100%', borderRadius: '0.375rem' },
    center,
    zoom,
    zoomControl: false,
    attributionControl: true,
    preferCanvas: true, // Improves performance for many markers
  };

  // Filter points by time index if available
  const filteredPoints = points.filter(point => 
    !point.hasOwnProperty('timeIndex') || point.timeIndex === currentTimeIndex
  );

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
      case 'cluster':
        // For cluster view, use a light detailed background
        return {
          url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
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

  // Check if data layer is active
  const isDataLayerActive = activeLayers.includes('data');

  // Determine which visualization layer to render
  const renderVisualizationLayer = () => {
    if (!isDataLayerActive || (!filteredPoints.length && !geoJSON)) return null;

    switch (visualizationType) {
      case 'choropleth':
        // Show GeoJSON layer for choropleth
        return geoJSON ? (
          <GeoJSONLayer 
            geoJSON={geoJSON} 
            visualizationType="choropleth" 
            category={category}
            timeIndex={currentTimeIndex}
          />
        ) : null;
      
      case 'heatmap':
        // Show heatmap layer if we have points
        return filteredPoints.length > 0 ? <HeatmapLayer points={filteredPoints} /> : null;
      
      case 'cluster':
        // Show cluster markers if we have points
        return filteredPoints.length > 0 ? <ClusterMarkers points={filteredPoints} /> : null;
      
      case 'standard':
      default:
        // Standard view - show GeoJSON if available, otherwise show point markers
        if (geoJSON) {
          return (
            <GeoJSONLayer 
              geoJSON={geoJSON} 
              visualizationType="standard" 
              category={category}
              timeIndex={currentTimeIndex}
            />
          );
        } else if (filteredPoints.length > 0) {
          return <PointMarkers points={filteredPoints} />;
        }
        return null;
    }
  };

  return (
    <LeafletMapContainer {...mapContainerProps}>
      {activeLayers.includes('base') && <TileLayer {...tileLayerProps} />}
      <ZoomControl position="topright" />
      {renderVisualizationLayer()}
      
      {/* Optional Layer Controls using Leaflet's built-in control */}
      {activeLayers.includes('labels') && (
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      )}
    </LeafletMapContainer>
  );
};

export default MapContainerComponent;
