
import React from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import EnhancedMapVisualization from '../EnhancedMapVisualization';

import MapLoadingState from './MapLoadingState';
import MapVisualizationContent from './components/MapVisualizationContent';
import { generateSampleGeoData, sampleInsights, sampleRegions, availableLayers } from './data/sampleData';
import { useCorrelationState } from './hooks/useCorrelationState';
import { useLayerBlending } from './hooks/useLayerBlending';
import { useMapState } from './hooks/useMapState';
import { MapVisualizationProps } from './types';
import { useMapData } from './useMapData';

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  data = [],
  geoJSON = null,
  title = 'Map Visualization',
  description = 'Explore geographic data visually',
  isLoading = false,
  category = 'general'
}) => {
  // Custom hooks for state management
  const {
    visualizationType,
    setVisualizationType,
    anomalyDetection,
    setAnomalyDetection,
    anomalyThreshold,
    setAnomalyThreshold,
    timeIndex,
    setTimeIndex,
    activeLayers,
    setActiveLayers,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useMapState();

  const {
    isAnalyzingCorrelation,
    correlationValue,
    handleAnalyzeCorrelation
  } = useCorrelationState();

  const {
    primaryLayer,
    setPrimaryLayer,
    secondaryLayer,
    setSecondaryLayer,
    blendMode,
    setBlendMode,
    opacity,
    setOpacity
  } = useLayerBlending();
  
  // Determine what data to use for the map
  let dataToUse = data;
  if (!data || data.length === 0) {
    console.log(`No geographic data provided for ${title}, using sample data`);
    dataToUse = generateSampleGeoData(category);
  }
  
  const mapData = useMapData(dataToUse, geoJSON, isLoading);
  const points = mapData.pointsData.validPoints || [];
  
  // Default center and zoom level
  const defaultCenter = mapData.mapCenter || [20, 0];
  const defaultZoom = mapData.mapZoom || 2;
  
  // Handle visualization type change
  const handleVisualizationTypeChange = (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => {
    setVisualizationType(type);
  };
  
  // Handle anomaly detection toggle
  const handleAnomalyToggle = (enabled: boolean) => {
    setAnomalyDetection(enabled);
  };
  
  // Handle anomaly threshold change
  const handleThresholdChange = (value: number) => {
    setAnomalyThreshold(value);
  };
  
  // Handle time index change
  const handleTimeIndexChange = (index: number) => {
    setTimeIndex(index);
  };
  
  // Handle spatial filtering
  const handleSpatialFilterChange = (filter: any) => {
    console.log("Applied spatial filter:", filter);
  };
  
  // Handle insight application
  const handleApplyInsight = (insightId: string) => {
    console.log(`Applying insight ${insightId}`);
    
    const insight = sampleInsights.find(item => item.id === insightId);
    if (insight) {
      switch (insight.type) {
        case 'anomaly':
          setAnomalyDetection(true);
          break;
        case 'correlation':
          // Would implement correlation visualization
          break;
      }
    }
  };

  // Function to refresh insights
  const handleRefreshInsights = () => {
    console.log("Refreshing insights...");
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return <MapLoadingState title={title} description={description} />;
  }

  // Check if we should show enhanced visualization (for certain categories or when we have rich data)
  const showEnhancedVisualization = category.toLowerCase().includes('demographic') || 
                                   category.toLowerCase().includes('retail') ||
                                   category.toLowerCase().includes('population') ||
                                   title.toLowerCase().includes('retail') ||
                                   title.toLowerCase().includes('demographic');

  if (showEnhancedVisualization) {
    return (
      <EnhancedMapVisualization
        title={title}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        geoJSON={geoJSON}
        points={points}
        visualizationType={visualizationType}
        category={category}
        currentTimeIndex={timeIndex}
        activeLayers={activeLayers}
        anomalyDetection={anomalyDetection}
        anomalyThreshold={anomalyThreshold}
      />
    );
  }

  // Prepare sidebar props
  const sidebarProps = {
    anomalyDetection,
    anomalyThreshold,
    handleAnomalyToggle,
    handleThresholdChange,
    availableLayers,
    correlationValue,
    isAnalyzingCorrelation,
    handleAnalyzeCorrelation,
    sampleRegions,
    handleSpatialFilterChange,
    primaryLayer,
    secondaryLayer,
    blendMode,
    opacity,
    setPrimaryLayer,
    setSecondaryLayer,
    setBlendMode,
    setOpacity,
    sampleInsights,
    handleApplyInsight,
    handleRefreshInsights
  };

  // Prepare layout props
  const layoutProps = {
    sidebarCollapsed,
    visualizationType,
    handleVisualizationTypeChange,
    geoJSON,
    points,
    defaultCenter,
    defaultZoom,
    category,
    timeIndex,
    activeLayers,
    setActiveLayers,
    anomalyDetection,
    anomalyThreshold,
    toggleSidebar,
    sidebarProps
  };

  return (
    <MapVisualizationContent
      title={title}
      description={description}
      anomalyDetection={anomalyDetection}
      data={data}
      layoutProps={layoutProps}
    />
  );
};
