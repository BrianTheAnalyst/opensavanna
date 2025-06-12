
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import VisualizationLayerRenderer from './VisualizationLayerRenderer';
import { MapContainerProps } from './types';

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
  anomalyThreshold = 2.0,
  onMapMove
}) => {
  // Filter points by time index if available
  const filteredPoints = points.filter(point => 
    !point.hasOwnProperty('timeIndex') || point.timeIndex === currentTimeIndex
  );

  // Check if data layer is active
  const isDataLayerActive = activeLayers.includes('data');

  return (
    <div className="h-full w-full relative">
      <LeafletMapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-none"
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
        attributionControl={true}
      >
        {/* Base Layer */}
        {activeLayers.includes('base') && (
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}
        
        {/* Zoom Control */}
        <ZoomControl position="topright" />
        
        {/* Data Visualization Layer */}
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
        
        {/* Labels Layer */}
        {activeLayers.includes('labels') && (
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        )}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainerComponent;
