
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import VisualizationLayerRenderer from './VisualizationLayerRenderer';
import { MapContainerProps } from './types';
import { getTileLayer } from './utils/tileLayerUtils';

// Renamed component to avoid confusion with React-Leaflet's MapContainer
const MapContainerComponent: React.FC<MapContainerProps> = ({
  defaultCenter,
  defaultZoom,
  geoJSON,
  points = [],
  visualizationType = 'standard',
  category,
  currentTimeIndex = 0,
  activeLayers = ['base', 'data'],
  anomalyDetection = false,
  anomalyThreshold = 2.0
}) => {
  // Filter points by time index if available
  const filteredPoints = points.filter(point => 
    !point.hasOwnProperty('timeIndex') || point.timeIndex === currentTimeIndex
  );

  // Get the appropriate tile layer based on visualization type
  const tileLayerProps = getTileLayer(visualizationType);

  // Check if data layer is active
  const isDataLayerActive = activeLayers.includes('data');

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}>
      {/* 
        When using LeafletMapContainer, we need to match its expected prop names exactly
        according to the React-Leaflet API
      */}
      <LeafletMapContainer
        // Use the expected prop names for React-Leaflet
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        // Add a key to force re-render when center or zoom changes
        key={`${defaultCenter[0]}-${defaultCenter[1]}-${defaultZoom}`}
        // Adding attributionControl={false} to avoid TypeScript errors
        attributionControl={false}
      >
        {activeLayers.includes('base') && (
          <TileLayer 
            url={tileLayerProps.url}
            attribution={tileLayerProps.attribution || ''}
          />
        )}
        <ZoomControl position="topright" />
        
        <VisualizationLayerRenderer 
          visualizationType={visualizationType}
          geoJSON={geoJSON}
          points={filteredPoints}
          category={category}
          currentTimeIndex={currentTimeIndex}
          isActive={isDataLayerActive}
          anomalyDetection={anomalyDetection}
          anomalyThreshold={anomalyThreshold}
        />
        
        {activeLayers.includes('labels') && (
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
        )}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainerComponent;
