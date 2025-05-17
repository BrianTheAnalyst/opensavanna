
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BarChart3,
  Layers,
  Map as MapIcon,
  AlertCircle,
  Crosshair,
  Thermometer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import AnomalyControls from '../AnomalyControls';
import TimeControls from '../TimeControls';
import MapLoadingState from './MapLoadingState';
import MapEmptyState from './MapEmptyState';
import { useMapData } from './useMapData';
import { MapVisualizationProps, Insight } from './types';
import MapContainerComponent from '../MapContainer';
import { detectAnomalies } from '../utils/anomalyDetection';
import SpatialFilterPanel from '../SpatialFilterPanel';
import CorrelationPanel from '../CorrelationPanel';
import LayerBlendingControls from '../LayerBlendingControls';
import InsightSuggestionPanel from '../InsightSuggestionPanel';

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  data = [],
  geoJSON = null,
  title = 'Map Visualization',
  description = 'Explore geographic data visually',
  isLoading = false,
  category = 'general'
}) => {
  // State for visualization settings
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap' | 'cluster'>('standard');
  const [anomalyDetection, setAnomalyDetection] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState(2);
  const [timeIndex, setTimeIndex] = useState(0);
  const [activeLayers, setActiveLayers] = useState<string[]>(['base', 'data']);
  
  // State for correlation analysis
  const [isAnalyzingCorrelation, setIsAnalyzingCorrelation] = useState(false);
  const [correlationValue, setCorrelationValue] = useState<number | null>(null);
  
  // State for layer blending
  const [primaryLayer, setPrimaryLayer] = useState('temperature');
  const [secondaryLayer, setSecondaryLayer] = useState('precipitation');
  const [blendMode, setBlendMode] = useState('normal');
  const [opacity, setOpacity] = useState(0.7);
  
  // Define available layers for selection
  const availableLayers = [
    { id: 'temperature', name: 'Temperature', category: 'Climate' },
    { id: 'precipitation', name: 'Precipitation', category: 'Climate' },
    { id: 'wind', name: 'Wind Speed', category: 'Climate' },
    { id: 'humidity', name: 'Humidity', category: 'Climate' },
    { id: 'population', name: 'Population Density', category: 'Demographics' },
    { id: 'income', name: 'Per Capita Income', category: 'Economics' },
    { id: 'land_cover', name: 'Land Cover', category: 'Environment' },
    { id: 'co2', name: 'CO2 Emissions', category: 'Environment' }
  ];
  
  // Sample insights for insight panel with properly typed 'type' property
  const sampleInsights: Insight[] = [
    {
      id: '1',
      title: 'Temperature anomaly cluster',
      description: 'Detected unusual temperature pattern in the northwest region during summer months.',
      type: 'anomaly',
      confidence: 0.89,
      applied: false
    },
    {
      id: '2',
      title: 'Strong correlation detected',
      description: 'Air pollution levels show significant correlation with traffic density patterns across urban centers.',
      type: 'correlation',
      confidence: 0.76,
      applied: false
    },
    {
      id: '3',
      title: 'Seasonal precipitation trend',
      description: 'Eastern regions show consistent seasonal precipitation patterns with 15% variation from historical averages.',
      type: 'temporal',
      confidence: 0.94,
      applied: false
    }
  ];
  
  // Define sample regions for spatial filtering
  const sampleRegions = [
    { id: 'north', name: 'Northern Region' },
    { id: 'south', name: 'Southern Region' },
    { id: 'east', name: 'Eastern Region' },
    { id: 'west', name: 'Western Region' },
    { id: 'central', name: 'Central Area' }
  ];
  
  const mapData = useMapData(data, geoJSON, isLoading);
  const points = mapData.pointsData?.validPoints || [];
  
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
  
  // Handle correlation analysis
  const handleAnalyzeCorrelation = (variable1: string, variable2: string) => {
    setIsAnalyzingCorrelation(true);
    setCorrelationValue(null);
    
    // Simulate correlation analysis with a timeout
    setTimeout(() => {
      // In a real application, this would be calculated from actual data
      const correlation = (Math.random() * 1.4 - 0.2).toFixed(2);
      setCorrelationValue(parseFloat(correlation));
      setIsAnalyzingCorrelation(false);
    }, 1500);
  };
  
  // Handle spatial filtering
  const handleSpatialFilterChange = (filter: any) => {
    console.log("Applied spatial filter:", filter);
    // In a real app, this would filter the data based on spatial parameters
  };
  
  // Handle insight application
  const handleApplyInsight = (insightId: string) => {
    // Implement insight application logic
    console.log(`Applying insight ${insightId}`);
    
    // Update insights list to mark as applied
    const updatedInsights = sampleInsights.map(insight => 
      insight.id === insightId 
        ? { ...insight, applied: !insight.applied }
        : insight
    );
    
    // In a real app, we would modify the state based on the insight type
    const insight = sampleInsights.find(item => item.id === insightId);
    if (insight) {
      switch (insight.type) {
        case 'anomaly':
          setAnomalyDetection(true);
          break;
        case 'correlation':
          // Would implement correlation visualization
          break;
        case 'temporal':
          // Would implement time series visualization
          break;
        case 'spatial':
          // Would implement spatial highlight
          break;
      }
    }
  };

  // Function to refresh insights (placeholder)
  const handleRefreshInsights = () => {
    console.log("Refreshing insights...");
    // Would fetch new insights in a real application
  };

  if (isLoading) {
    return <MapLoadingState title={title} description={description} />;
  }

  if ((!points || points.length === 0) && !geoJSON) {
    return <MapEmptyState title={title} description="No geographic data available for visualization." />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Map Area */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              {/* Visualization Type Tabs */}
              <Tabs defaultValue={visualizationType} className="h-full flex flex-col">
                <TabsList className="mx-4 mt-4 bg-muted/60 grid w-full grid-cols-4">
                  <TabsTrigger value="standard" onClick={() => handleVisualizationTypeChange('standard')}>
                    <MapIcon className="h-4 w-4 mr-2" /> Standard
                  </TabsTrigger>
                  <TabsTrigger value="choropleth" onClick={() => handleVisualizationTypeChange('choropleth')}>
                    <Layers className="h-4 w-4 mr-2" /> Choropleth
                  </TabsTrigger>
                  <TabsTrigger value="heatmap" onClick={() => handleVisualizationTypeChange('heatmap')}>
                    <Thermometer className="h-4 w-4 mr-2" /> Heatmap
                  </TabsTrigger>
                  <TabsTrigger value="cluster" onClick={() => handleVisualizationTypeChange('cluster')}>
                    <Crosshair className="h-4 w-4 mr-2" /> Clusters
                  </TabsTrigger>
                </TabsList>
                
                {/* Map Visualization Area */}
                <TabsContent value={visualizationType} className="flex-1 m-0 p-4">
                  <div className="h-full relative">
                    <MapContainerComponent 
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
                    
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/95 backdrop-blur-sm rounded-t-md border-t">
                      <TimeControls 
                        currentIndex={timeIndex}
                        maxIndex={10} 
                        onChange={handleTimeIndexChange}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Controls */}
        <div className="space-y-4">
          <AnomalyControls 
            anomalyDetection={anomalyDetection} 
            onAnomalyToggle={handleAnomalyToggle} 
            anomalyThreshold={anomalyThreshold}
            onThresholdChange={handleThresholdChange}
          />
          
          <CorrelationPanel
            availableVariables={availableLayers}
            onAnalyze={handleAnalyzeCorrelation}
            correlationValue={correlationValue}
            isAnalyzing={isAnalyzingCorrelation}
          />
          
          <SpatialFilterPanel
            onFilterChange={handleSpatialFilterChange}
            regions={sampleRegions}
            isFiltering={false}
          />
          
          <LayerBlendingControls 
            primaryLayer={primaryLayer}
            secondaryLayer={secondaryLayer}
            availableLayers={availableLayers}
            blendMode={blendMode}
            blendOpacity={opacity}
            onPrimaryLayerChange={setPrimaryLayer}
            onSecondaryLayerChange={setSecondaryLayer}
            onBlendModeChange={setBlendMode}
            onBlendOpacityChange={setOpacity}
          />
          
          <InsightSuggestionPanel
            insights={sampleInsights}
            loading={false}
            onInsightApply={handleApplyInsight}
            onRefreshInsights={handleRefreshInsights}
          />
        </div>
      </div>
      
      <div>
        <div className="flex gap-2 items-center">
          <Switch
            id="show-labels"
            checked={activeLayers.includes('labels')}
            onCheckedChange={(checked) => {
              if (checked) {
                setActiveLayers([...activeLayers, 'labels']);
              } else {
                setActiveLayers(activeLayers.filter(layer => layer !== 'labels'));
              }
            }}
          />
          <Label htmlFor="show-labels">Show Map Labels</Label>
        </div>
      </div>
    </div>
  );
};
