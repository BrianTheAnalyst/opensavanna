
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import VisualizationLayerRenderer from './VisualizationLayerRenderer';
import { MapContainerProps } from './types';
import { getTileLayer } from './utils/tileLayerUtils';

// Renamed component to avoid confusion with React-Leaflet's MapContainer
const MapContainerComponent: React.FC<MapContainerProps> = ({
  center,
  zoom,
  geoJSON,
  points = [],
  visualizationType = 'standard',
  category,
  currentTimeIndex = 0,
  activeLayers = ['base', 'data']
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
      {/* The key issue was here - using the spread syntax to pass all required props */}
      <LeafletMapContainer
        key="map-container"
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {activeLayers.includes('base') && (
          <TileLayer 
            url={tileLayerProps.url}
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
        />
        
        {/* Optional Layer Controls using Leaflet's built-in control */}
        {activeLayers.includes('labels') && (
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          />
        )}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainerComponent;
