
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Layers,
  MapIcon,
  AlertCircle,
  Crosshair,
  Thermometer,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AnomalyControls from '../AnomalyControls';
import TimeControls from '../TimeControls';
import MapLoadingState from './MapLoadingState';
import MapEmptyState from './MapEmptyState';
import { useMapData } from './useMapData';
import { MapVisualizationProps, Insight } from './types';
import MapContainerComponent from '../MapContainer';
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

  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return <MapLoadingState title={title} description={description} />;
  }

  if ((!points || points.length === 0) && !geoJSON) {
    return <MapEmptyState title={title} description="No geographic data available for visualization." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="bg-primary/10">
          {anomalyDetection ? 'Anomaly Detection: On' : 'Standard View'}
        </Badge>
      </div>
      
      <div className="relative flex">
        {/* Main Map Area */}
        <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-full' : 'w-full lg:w-3/4 xl:w-4/5'}`}>
          <Card className="h-[600px] shadow-md">
            <CardContent className="p-0 h-full">
              {/* Visualization Type Tabs */}
              <Tabs defaultValue={visualizationType} className="h-full flex flex-col">
                <TabsList className="mx-4 mt-4 bg-muted/60 grid w-full grid-cols-4">
                  <TabsTrigger 
                    value="standard" 
                    onClick={() => handleVisualizationTypeChange('standard')}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    <MapIcon className="h-4 w-4 mr-2" /> Standard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="choropleth" 
                    onClick={() => handleVisualizationTypeChange('choropleth')}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    <Layers className="h-4 w-4 mr-2" /> Choropleth
                  </TabsTrigger>
                  <TabsTrigger 
                    value="heatmap" 
                    onClick={() => handleVisualizationTypeChange('heatmap')}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    <Thermometer className="h-4 w-4 mr-2" /> Heatmap
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cluster" 
                    onClick={() => handleVisualizationTypeChange('cluster')}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    <Crosshair className="h-4 w-4 mr-2" /> Clusters
                  </TabsTrigger>
                </TabsList>
                
                {/* Map Visualization Area */}
                <TabsContent value={visualizationType} className="flex-1 m-0 p-4">
                  <div className="h-full relative rounded-md overflow-hidden">
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
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm rounded-t-md border-t">
                      <TimeControls 
                        currentIndex={timeIndex}
                        setCurrentIndex={handleTimeIndexChange}
                        maxIndex={10}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
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
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="show-labels" className="text-sm">Show Map Labels</Label>
            </div>
            
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleSidebar}
                className="border border-border/40 hover:bg-muted transition-colors"
              >
                {sidebarCollapsed ? (
                  <>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Show Controls
                  </>
                ) : (
                  <>
                    Hide Controls <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar Controls */}
        {!sidebarCollapsed && (
          <div className={`w-1/4 xl:w-1/5 ml-4 space-y-4 transition-all duration-300 hidden lg:block animate-fade-in`}>
            <div className="space-y-4 sticky top-4">
              <AnomalyControls 
                anomalyDetection={anomalyDetection} 
                onAnomalyToggle={handleAnomalyToggle} 
                anomalyThreshold={anomalyThreshold}
                onThresholdChange={handleThresholdChange}
              />
              
              <CorrelationPanel
                variables={availableLayers}
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
        )}
      </div>
      
      {/* Mobile Controls (shown when sidebar is collapsed on mobile) */}
      {sidebarCollapsed && (
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-fade-in">
            <AnomalyControls 
              anomalyDetection={anomalyDetection} 
              onAnomalyToggle={handleAnomalyToggle} 
              anomalyThreshold={anomalyThreshold}
              onThresholdChange={handleThresholdChange}
            />
            
            <CorrelationPanel
              variables={availableLayers}
              onAnalyze={handleAnalyzeCorrelation}
              correlationValue={correlationValue}
              isAnalyzing={isAnalyzingCorrelation}
            />
          </div>
        </div>
      )}
      
      {/* Mobile Controls Button */}
      <div className="lg:hidden">
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? 'Show All Controls' : 'Hide Controls'}
          {sidebarCollapsed ? <ChevronLeft className="ml-1 h-4 w-4" /> : <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
