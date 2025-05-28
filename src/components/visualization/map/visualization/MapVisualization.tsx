
import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MapLoadingState from './MapLoadingState';
import MapEmptyState from './MapEmptyState';
import { useMapData } from './useMapData';
import { MapVisualizationProps } from './types';
import { useMapState } from './MapState';
import { useMapInsights } from './MapInsights';
import { useMapLayers } from './MapLayers';
import { useMapRegions } from './MapRegions';
import { useMapHandlers } from './MapHandlers';

import MapHeader from './MapHeader';
import MapVisualizationTabs from './MapVisualizationTabs';
import MapLayerControls from './MapLayerControls';
import MapSidebar from './MapSidebar';
import AnomalyControls from '../AnomalyControls';
import CorrelationPanel from '../CorrelationPanel';

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  data = [],
  geoJSON = null,
  title = 'Map Visualization',
  description = 'Explore geographic data visually',
  isLoading = false,
  category = 'general'
}) => {
  const [state, actions] = useMapState();
  const sampleInsights = useMapInsights(category);
  const availableLayers = useMapLayers(category);
  const sampleRegions = useMapRegions(data);
  
  const handlers = useMapHandlers(
    actions.setVisualizationType,
    actions.setAnomalyDetection,
    actions.setAnomalyThreshold,
    actions.setTimeIndex,
    actions.setIsAnalyzingCorrelation,
    actions.setCorrelationValue,
    sampleInsights
  );

  const mapData = useMapData(data, geoJSON, isLoading);
  const points = mapData.pointsData?.validPoints || [];
  
  const defaultCenter = mapData.mapCenter || [20, 0];
  const defaultZoom = mapData.mapZoom || 2;

  const toggleSidebar = () => {
    actions.setSidebarCollapsed(!state.sidebarCollapsed);
  };

  if (isLoading) {
    return <MapLoadingState title={title} description={description} />;
  }

  if ((!points || points.length === 0) && !geoJSON) {
    return <MapEmptyState title={title} description="No geographic data available for visualization." />;
  }

  return (
    <div className="space-y-4">
      <MapHeader 
        title={title} 
        description={description} 
        anomalyDetection={state.anomalyDetection} 
      />
      
      <div className="relative flex">
        <div className={`transition-all duration-300 ease-in-out ${state.sidebarCollapsed ? 'w-full' : 'w-full lg:w-3/4 xl:w-4/5'}`}>
          <Card className="h-[600px] shadow-md">
            <CardContent className="p-0 h-full">
              <MapVisualizationTabs
                visualizationType={state.visualizationType}
                handleVisualizationTypeChange={handlers.handleVisualizationTypeChange}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                geoJSON={geoJSON}
                points={points}
                category={category}
                timeIndex={state.timeIndex}
                activeLayers={state.activeLayers}
                anomalyDetection={state.anomalyDetection}
                anomalyThreshold={state.anomalyThreshold}
                handleTimeIndexChange={handlers.handleTimeIndexChange}
              />
            </CardContent>
          </Card>

          <MapLayerControls 
            activeLayers={state.activeLayers}
            setActiveLayers={actions.setActiveLayers}
            sidebarCollapsed={state.sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </div>
        
        {!state.sidebarCollapsed && (
          <div className={`w-1/4 xl:w-1/5 ml-4 space-y-4 transition-all duration-300 hidden lg:block animate-fade-in`}>
            <MapSidebar 
              anomalyDetection={state.anomalyDetection}
              anomalyThreshold={state.anomalyThreshold}
              handleAnomalyToggle={handlers.handleAnomalyToggle}
              handleThresholdChange={handlers.handleThresholdChange}
              availableLayers={availableLayers}
              correlationValue={state.correlationValue}
              isAnalyzingCorrelation={state.isAnalyzingCorrelation}
              handleAnalyzeCorrelation={handlers.handleAnalyzeCorrelation}
              sampleRegions={sampleRegions}
              handleSpatialFilterChange={handlers.handleSpatialFilterChange}
              primaryLayer={state.primaryLayer}
              secondaryLayer={state.secondaryLayer}
              blendMode={state.blendMode}
              opacity={state.opacity}
              setPrimaryLayer={actions.setPrimaryLayer}
              setSecondaryLayer={actions.setSecondaryLayer}
              setBlendMode={actions.setBlendMode}
              setOpacity={actions.setOpacity}
              sampleInsights={sampleInsights}
              handleApplyInsight={handlers.handleApplyInsight}
              handleRefreshInsights={handlers.handleRefreshInsights}
            />
          </div>
        )}
      </div>
      
      {state.sidebarCollapsed && (
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-fade-in">
            <AnomalyControls 
              anomalyDetection={state.anomalyDetection} 
              onAnomalyToggle={handlers.handleAnomalyToggle} 
              anomalyThreshold={state.anomalyThreshold}
              onThresholdChange={handlers.handleThresholdChange}
            />
            
            <CorrelationPanel
              variables={availableLayers}
              onAnalyze={handlers.handleAnalyzeCorrelation}
              correlationValue={state.correlationValue}
              isAnalyzing={state.isAnalyzingCorrelation}
            />
          </div>
        </div>
      )}
      
      <div className="lg:hidden">
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={toggleSidebar}
        >
          {state.sidebarCollapsed ? 'Show All Controls' : 'Hide Controls'}
          {state.sidebarCollapsed ? <ChevronLeft className="ml-1 h-4 w-4" /> : <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
