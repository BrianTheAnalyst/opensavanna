
import React, { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useLeafletIconFix } from '../useLeafletIconFix';
import { getTileLayer } from '../utils/tileLayerUtils';
import { MapPoint } from '../types';
import MapEmptyState from './MapEmptyState';
import MapLoadingState from './MapLoadingState';
import LayerControls from '../LayerControls';
import MapControls from '../MapControls';
import TimeControls from '../TimeControls';
import VisualizationLayerRenderer from '../VisualizationLayerRenderer';
import MapLegend from '../MapLegend';
import { useMapData } from './useMapData';
import { MapVisualizationProps } from './types';
import MapContainer from '../MapContainer';

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  data = [],
  geoJSON,
  category = 'General',
  isLoading = false,
  title,
  description
}) => {
  useLeafletIconFix();
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap' | 'cluster'>('standard');
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [showTimeControls, setShowTimeControls] = useState(false);
  const [tileLayer, setTileLayer] = useState(getTileLayer('standard'));
  
  const mapData = useMapData(data, geoJSON, isLoading);
  const points = mapData.pointsData?.validPoints || [];
  
  // Show time controls if time series data is detected
  useEffect(() => {
    setShowTimeControls(mapData.hasTimeSeriesData);
  }, [mapData.hasTimeSeriesData]);
  
  // Reset time index when data changes
  useEffect(() => {
    setCurrentTimeIndex(0);
  }, [data, geoJSON]);
  
  // Show loading state
  if (isLoading) {
    return <MapLoadingState 
      title={title || "Loading Map Data"} 
      description={description || "Please wait while we prepare your visualization..."} 
    />;
  }
  
  // Show empty state if no data
  if ((points.length === 0 && !geoJSON) || (!data || data.length === 0)) {
    return <MapEmptyState 
      title={title || "No Map Data Available"} 
      description={description || "There is no geographic data available for this dataset."} 
    />;
  }
  
  return (
    <div className="relative w-full h-[500px] bg-slate-50 rounded-lg overflow-hidden">
      <MapContainer
        center={mapData.mapCenter}
        zoom={mapData.mapZoom}
        geoJSON={geoJSON}
        points={points as MapPoint[]}
        visualizationType={visualizationType}
        category={category}
        currentTimeIndex={currentTimeIndex}
      />
      
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-md">
        {showTimeControls && (
          <TimeControls
            currentIndex={currentTimeIndex}
            setCurrentIndex={setCurrentTimeIndex}
            labels={mapData.timeLabels}
          />
        )}
      </div>
      
      <div className="absolute top-3 right-3 z-10">
        <LayerControls
          onTileLayerChange={setTileLayer}
        />
      </div>
      
      <div className="absolute top-3 left-3 z-10">
        <MapControls
          currentType={visualizationType}
          setType={setVisualizationType}
          hasGeoJSON={!!geoJSON}
          hasPoints={points.length > 0}
        />
      </div>
      
      <MapLegend
        visualizationType={visualizationType}
        geoJSON={geoJSON}
        category={category}
      />
    </div>
  );
};

export default MapVisualization;
