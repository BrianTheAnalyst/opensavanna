
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
import CorrelationPanel from '../CorrelationPanel';
import LayerBlendingControls from '../LayerBlendingControls';
import InsightSuggestionPanel from '../InsightSuggestionPanel';
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
  const [showSidePanels, setShowSidePanels] = useState(true);
  const [correlationValue, setCorrelationValue] = useState<number | null>(null);
  const [isAnalyzingCorrelation, setIsAnalyzingCorrelation] = useState(false);
  const [primaryLayer, setPrimaryLayer] = useState('base');
  const [secondaryLayer, setSecondaryLayer] = useState('data');
  const [blendMode, setBlendMode] = useState('normal');
  const [blendOpacity, setBlendOpacity] = useState(0.7);
  
  // Sample variables for correlation panel
  const variables = [
    { id: 'temperature', name: 'Temperature', category: 'Climate' },
    { id: 'precipitation', name: 'Precipitation', category: 'Climate' },
    { id: 'population', name: 'Population', category: 'Demographics' },
    { id: 'gdp', name: 'GDP', category: 'Economics' },
    { id: 'co2', name: 'CO2 Emissions', category: 'Environment' }
  ];
  
  // Sample insights for insight panel
  const sampleInsights = [
    {
      id: '1',
      title: 'Temperature anomaly cluster',
      description: 'There appears to be a cluster of temperature anomalies in the northern region during summer months.',
      type: 'anomaly',
      confidence: 0.85,
      applied: false
    },
    {
      id: '2',
      title: 'Population correlates with CO2',
      description: 'Strong positive correlation (0.78) between population density and CO2 emissions across urban areas.',
      type: 'correlation',
      confidence: 0.75,
      applied: true
    },
    {
      id: '3',
      title: 'Seasonal precipitation pattern',
      description: 'Temporal analysis shows a significant shift in precipitation patterns during El Niño years.',
      type: 'temporal',
      confidence: 0.62,
      applied: false
    }
  ];
  
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
  
  // Handle correlation analysis
  const handleCorrelationAnalyze = (var1: string, var2: string) => {
    setIsAnalyzingCorrelation(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a random correlation between -1 and 1
      // In a real app, this would call an actual correlation calculation service
      const correlation = (Math.random() * 2 - 1).toFixed(2);
      setCorrelationValue(parseFloat(correlation));
      setIsAnalyzingCorrelation(false);
    }, 1500);
  };
  
  // Handle insight application
  const handleInsightApply = (insightId: string) => {
    // In a real app, this would apply the insight to the visualization
    console.log(`Applying insight: ${insightId}`);
  };
  
  // Handle insight refresh
  const handleRefreshInsights = () => {
    // In a real app, this would refresh insights based on current data
    console.log("Refreshing insights");
  };
  
  // Available layers for blending
  const availableLayers = [
    { id: 'base', name: 'Base Map' },
    { id: 'data', name: 'Data Layer' },
    { id: 'temperature', name: 'Temperature' },
    { id: 'precipitation', name: 'Precipitation' },
    { id: 'population', name: 'Population' }
  ];
  
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
    <div className="relative w-full h-[500px] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
      <div className="flex h-full">
        {/* Main map container */}
        <div className={`relative ${showSidePanels ? 'w-3/4' : 'w-full'} h-full transition-all duration-300`}>
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
        
        {/* Side panels for advanced analysis */}
        {showSidePanels && (
          <div className="w-1/4 h-full bg-white/90 dark:bg-gray-900/90 p-3 overflow-y-auto space-y-4">
            <CorrelationPanel 
              variables={variables}
              onCorrelationAnalyze={handleCorrelationAnalyze}
              correlationValue={correlationValue}
              isAnalyzing={isAnalyzingCorrelation}
            />
            
            <LayerBlendingControls 
              primaryLayer={primaryLayer}
              secondaryLayer={secondaryLayer}
              blendMode={blendMode}
              blendOpacity={blendOpacity}
              availableLayers={availableLayers}
              onPrimaryLayerChange={setPrimaryLayer}
              onSecondaryLayerChange={setSecondaryLayer}
              onBlendModeChange={setBlendMode}
              onBlendOpacityChange={setBlendOpacity}
            />
            
            <InsightSuggestionPanel 
              insights={sampleInsights}
              loading={false}
              onInsightApply={handleInsightApply}
              onRefreshInsights={handleRefreshInsights}
            />
          </div>
        )}
      </div>
      
      {/* Toggle side panels button */}
      <button 
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-primary text-primary-foreground p-1 px-2 rounded-l-md z-20"
        onClick={() => setShowSidePanels(!showSidePanels)}
      >
        {showSidePanels ? '»' : '«'}
      </button>
    </div>
  );
};

export default MapVisualization;
