
import React, { useCallback } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import VisualizationLayerRenderer from './VisualizationLayerRenderer';
import { MapContainerProps } from './types';
import { getTileLayer } from './utils/tileLayerUtils';

// MapEvents component to handle map events that need map context
const MapEvents: React.FC<{ onMoveEnd?: (center: [number, number], zoom: number) => void }> = ({ onMoveEnd }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (onMoveEnd) {
      const handleMoveEnd = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMoveEnd([center.lat, center.lng], zoom);
      };
      
      map.on('moveend', handleMoveEnd);
      return () => {
        map.off('moveend', handleMoveEnd);
      };
    }
  }, [map, onMoveEnd]);
  
  return null;
};

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
  anomalyThreshold = 2.0,
  onMapMove
}) => {
  // Filter points by time index if available
  const filteredPoints = points.filter(point => 
    !point.hasOwnProperty('timeIndex') || point.timeIndex === currentTimeIndex
  );

  // Get the appropriate tile layer based on visualization type
  const tileLayerProps = getTileLayer(visualizationType);

  // Check if data layer is active
  const isDataLayerActive = activeLayers.includes('data');
  
  // Callback for map movement
  const handleMapMove = useCallback((center: [number, number], zoom: number) => {
    if (onMapMove) {
      onMapMove(center, zoom);
    }
  }, [onMapMove]);

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}>
      {/* 
        The MapContainer from react-leaflet expects different props than what TypeScript thinks.
        We need to work around this type issue.
      */}
      <LeafletMapContainer
        style={{ height: '100%', width: '100%' }}
        // Using type assertion to work around the TypeScript error
        // This tells TypeScript to trust us that these props are valid
        {...{
          center: defaultCenter,
          zoom: defaultZoom,
          key: `${defaultCenter[0]}-${defaultCenter[1]}-${defaultZoom}`,
          minZoom: 2,
          maxZoom: 18,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          attributionControl: false, // We'll add our own attribution if needed
        } as any}
      >
        {/* Map Events handler */}
        <MapEvents onMoveEnd={handleMapMove} />
      
        {activeLayers.includes('base') && (
          <TileLayer 
            url={tileLayerProps.url}
            // Remove the attribution prop as it's not recognized by TileLayerProps
            // Instead, we'll use attributionControl in the container config
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
            // Remove the attribution prop here too
          />
        )}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainerComponent;
