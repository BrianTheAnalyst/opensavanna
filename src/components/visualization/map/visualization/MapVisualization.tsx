
import React, { useEffect, useState } from 'react';
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
import MapLegend from '../MapLegend';
import AnomalyControls from '../AnomalyControls';
import AnomalyTimeline from '../AnomalyTimeline';
import { useMapData } from './useMapData';
import { MapVisualizationProps } from './types';
import MapContainerComponent from '../MapContainer';
import { detectAnomalies } from '../utils/anomalyDetection';

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
  const [anomalyDetection, setAnomalyDetection] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState(2.0);
  const [activeLayers, setActiveLayers] = useState(['base', 'data']);
  
  const mapData = useMapData(data, geoJSON, isLoading);
  const points = mapData.pointsData?.validPoints || [];
  
  // Process anomalies for points
  const processedPoints = React.useMemo(() => {
    if (anomalyDetection && points.length > 0) {
      return detectAnomalies(points, anomalyThreshold);
    }
    return points;
  }, [points, anomalyDetection, anomalyThreshold]);
  
  // Show time controls if time series data is detected
  useEffect(() => {
    setShowTimeControls(mapData.hasTimeSeriesData);
  }, [mapData.hasTimeSeriesData]);
  
  // Reset time index when data changes
  useEffect(() => {
    setCurrentTimeIndex(0);
  }, [data, geoJSON]);
  
  // Handle anomaly toggle
  const handleAnomalyToggle = (enabled: boolean) => {
    setAnomalyDetection(enabled);
  };
  
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
      <MapContainerComponent
        defaultCenter={mapData.mapCenter}
        defaultZoom={mapData.mapZoom}
        geoJSON={geoJSON}
        points={processedPoints as MapPoint[]}
        visualizationType={visualizationType}
        category={category}
        currentTimeIndex={currentTimeIndex}
        activeLayers={activeLayers}
        anomalyDetection={anomalyDetection}
        anomalyThreshold={anomalyThreshold}
      />
      
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-md">
        {showTimeControls && (
          <TimeControls
            currentIndex={currentTimeIndex}
            setCurrentIndex={setCurrentTimeIndex}
            labels={mapData.timeLabels}
          />
        )}
        
        {anomalyDetection && showTimeControls && (
          <AnomalyTimeline 
            points={processedPoints}
            labels={mapData.timeLabels}
            currentIndex={currentTimeIndex}
            onIndexChange={setCurrentTimeIndex}
          />
        )}
      </div>
      
      <div className="absolute top-3 right-3 z-10 space-y-2">
        <LayerControls
          onTileLayerChange={setTileLayer}
        />
        
        <AnomalyControls 
          anomalyDetection={anomalyDetection}
          onAnomalyToggle={handleAnomalyToggle}
          anomalyThreshold={anomalyThreshold}
          onThresholdChange={setAnomalyThreshold}
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
