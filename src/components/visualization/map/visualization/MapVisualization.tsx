
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
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

interface MapVisualizationProps {
  data?: any[];
  geoJSON?: any;
  category?: string;
  isLoading?: boolean;
}

interface MapEmptyStateProps {
  title?: string;
  description?: string;
}

interface MapLoadingStateProps {
  title?: string;
  description?: string;
}

interface LayerControlsProps {
  onTileLayerChange: (layer: any) => void;
}

interface TimeControlsProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  labels: string[];
}

interface MapControlsProps {
  currentType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  setType: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
  hasGeoJSON: boolean;
  hasPoints: boolean;
}

interface MapLegendProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  geoJSON?: any;
  category?: string;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  data = [],
  geoJSON,
  category = 'General',
  isLoading = false
}) => {
  useLeafletIconFix();
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap' | 'cluster'>('standard');
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [showTimeControls, setShowTimeControls] = useState(false);
  const [tileLayer, setTileLayer] = useState(getTileLayer('standard'));
  const mapData = useMapData(data, geoJSON);
  const points = mapData.pointsData?.validPoints || [];
  const hasTimeSeriesData = mapData.hasTimeSeriesData || false;
  const timeLabels = mapData.timeLabels || [];
  
  // Show time controls if time series data is detected
  useEffect(() => {
    setShowTimeControls(hasTimeSeriesData);
  }, [hasTimeSeriesData]);
  
  // Reset time index when data changes
  useEffect(() => {
    setCurrentTimeIndex(0);
  }, [data, geoJSON]);
  
  // Show loading state
  if (isLoading) {
    return <MapLoadingState 
      title="Loading Map Data" 
      description="Please wait while we prepare your visualization..." 
    />;
  }
  
  // Show empty state if no data
  if ((points.length === 0 && !geoJSON) || (!data || data.length === 0)) {
    return <MapEmptyState 
      title="No Map Data Available" 
      description="There is no geographic data available for this dataset." 
    />;
  }
  
  return (
    <div className="relative w-full h-[500px] bg-slate-50 rounded-lg overflow-hidden">
      <MapContainer
        center={[10, 0]}
        zoom={2}
        className="h-full w-full z-0"
        attributionControl={false}
      >
        <TileLayer
          attribution={tileLayer.attribution}
          url={tileLayer.url}
        />
        
        <VisualizationLayerRenderer
          visualizationType={visualizationType}
          geoJSON={geoJSON}
          points={points as MapPoint[]}
          category={category}
          currentTimeIndex={currentTimeIndex}
          isActive={true}
        />
        
        <LayerControls
          onTileLayerChange={setTileLayer}
        />
      </MapContainer>
      
      {showTimeControls && (
        <TimeControls
          currentIndex={currentTimeIndex}
          setCurrentIndex={setCurrentTimeIndex}
          labels={timeLabels}
        />
      )}
      
      <MapControls
        currentType={visualizationType}
        setType={setVisualizationType}
        hasGeoJSON={!!geoJSON}
        hasPoints={points.length > 0}
      />
      
      <MapLegend
        visualizationType={visualizationType}
        geoJSON={geoJSON}
        category={category}
      />
    </div>
  );
};

export default MapVisualization;
