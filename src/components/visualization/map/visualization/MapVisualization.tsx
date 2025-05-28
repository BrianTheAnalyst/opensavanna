import React, { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MapLoadingState from './MapLoadingState';
import MapEmptyState from './MapEmptyState';
import { useMapData } from './useMapData';
import { MapVisualizationProps, Insight } from './types';

// Import refactored components
import MapHeader from './MapHeader';
import MapVisualizationTabs from './MapVisualizationTabs';
import MapLayerControls from './MapLayerControls';
import MapSidebar from './MapSidebar';

// Import the components that were missing
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
  
  // Define available layers for selection based on category
  const availableLayers = useMemo(() => {
    const commonLayers = [
      { id: 'population', name: 'Population Density', category: 'Demographics' }
    ];
    
    // Add category-specific layers
    if (category.toLowerCase().includes('climate') || category.toLowerCase().includes('environment')) {
      return [
        ...commonLayers,
        { id: 'temperature', name: 'Temperature', category: 'Climate' },
        { id: 'precipitation', name: 'Precipitation', category: 'Climate' },
        { id: 'wind', name: 'Wind Speed', category: 'Climate' },
        { id: 'humidity', name: 'Humidity', category: 'Climate' },
        { id: 'land_cover', name: 'Land Cover', category: 'Environment' },
        { id: 'co2', name: 'CO2 Emissions', category: 'Environment' }
      ];
    } 
    else if (category.toLowerCase().includes('economic') || category.toLowerCase().includes('finance')) {
      return [
        ...commonLayers,
        { id: 'gdp', name: 'GDP', category: 'Economics' },
        { id: 'income', name: 'Income Level', category: 'Economics' },
        { id: 'poverty', name: 'Poverty Rate', category: 'Economics' },
        { id: 'unemployment', name: 'Unemployment', category: 'Economics' },
        { id: 'infrastructure', name: 'Infrastructure', category: 'Economics' }
      ];
    }
    else if (category.toLowerCase().includes('health')) {
      return [
        ...commonLayers,
        { id: 'healthcare_access', name: 'Healthcare Access', category: 'Health' },
        { id: 'disease', name: 'Disease Prevalence', category: 'Health' },
        { id: 'vaccination', name: 'Vaccination Rate', category: 'Health' },
        { id: 'mortality', name: 'Mortality Rate', category: 'Health' },
        { id: 'life_expectancy', name: 'Life Expectancy', category: 'Health' }
      ];
    }
    else {
      return [
        ...commonLayers,
        { id: 'temperature', name: 'Temperature', category: 'Climate' },
        { id: 'income', name: 'Income Level', category: 'Economics' },
        { id: 'healthcare_access', name: 'Healthcare Access', category: 'Health' },
        { id: 'education', name: 'Education Level', category: 'Education' }
      ];
    }
  }, [category]);
  
  // Generate category-aware insights
  const sampleInsights = useMemo(() => {
    const insights: Insight[] = [];
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('climate') || categoryLower.includes('environment')) {
      insights.push({
        id: '1',
        title: 'Temperature anomaly cluster',
        description: 'Detected unusual temperature pattern in the northwest region during summer months.',
        type: 'anomaly',
        confidence: 0.89,
        applied: false
      });
    }
    else if (categoryLower.includes('economic')) {
      insights.push({
        id: '1',
        title: 'Economic disparity cluster',
        description: 'Significant economic disparities detected between neighboring regions with similar resources.',
        type: 'anomaly',
        confidence: 0.78,
        applied: false
      });
    }
    else if (categoryLower.includes('health')) {
      insights.push({
        id: '1',
        title: 'Healthcare access gap',
        description: 'Substantial healthcare access disparities identified in adjacent administrative regions.',
        type: 'anomaly',
        confidence: 0.83,
        applied: false
      });
    }
    
    // Add generic insights
    insights.push({
      id: '2',
      title: 'Strong correlation detected',
      description: `${category} metrics show significant correlation with population density patterns across regions.`,
      type: 'correlation',
      confidence: 0.76,
      applied: false
    });
    
    insights.push({
      id: '3',
      title: 'Seasonal variation pattern',
      description: `Eastern regions show consistent seasonal ${category.toLowerCase()} patterns with 15% variation from historical averages.`,
      type: 'temporal',
      confidence: 0.94,
      applied: false
    });
    
    return insights;
  }, [category]);
  
  // Define sample regions for spatial filtering - use data regions if available
  const sampleRegions = useMemo(() => {
    // First check if we can extract regions from data
    const regions = new Set<string>();
    data.forEach(item => {
      if (item.region) regions.add(item.region);
    });
    
    if (regions.size > 0) {
      return Array.from(regions).map(region => ({ 
        id: region.toLowerCase().replace(/\s+/g, '_'), 
        name: region 
      }));
    }
    
    // Otherwise use generic regions
    return [
      { id: 'north', name: 'Northern Region' },
      { id: 'south', name: 'Southern Region' },
      { id: 'east', name: 'Eastern Region' },
      { id: 'west', name: 'Western Region' },
      { id: 'central', name: 'Central Area' }
    ];
  }, [data]);
  
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
  
  // Add useMemo to calculate these values
  const useMemo = React.useMemo;

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
        anomalyDetection={anomalyDetection} 
      />
      
      <div className="relative flex">
        {/* Main Map Area */}
        <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-full' : 'w-full lg:w-3/4 xl:w-4/5'}`}>
          <Card className="h-[600px] shadow-md">
            <CardContent className="p-0 h-full">
              <MapVisualizationTabs
                visualizationType={visualizationType}
                handleVisualizationTypeChange={handleVisualizationTypeChange}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                geoJSON={geoJSON}
                points={points}
                category={category}
                timeIndex={timeIndex}
                activeLayers={activeLayers}
                anomalyDetection={anomalyDetection}
                anomalyThreshold={anomalyThreshold}
                handleTimeIndexChange={handleTimeIndexChange}
              />
            </CardContent>
          </Card>

          <MapLayerControls 
            activeLayers={activeLayers}
            setActiveLayers={setActiveLayers}
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
        </div>
        
        {/* Sidebar Controls */}
        {!sidebarCollapsed && (
          <div className={`w-1/4 xl:w-1/5 ml-4 space-y-4 transition-all duration-300 hidden lg:block animate-fade-in`}>
            <MapSidebar 
              anomalyDetection={anomalyDetection}
              anomalyThreshold={anomalyThreshold}
              handleAnomalyToggle={handleAnomalyToggle}
              handleThresholdChange={handleThresholdChange}
              availableLayers={availableLayers}
              correlationValue={correlationValue}
              isAnalyzingCorrelation={isAnalyzingCorrelation}
              handleAnalyzeCorrelation={handleAnalyzeCorrelation}
              sampleRegions={sampleRegions}
              handleSpatialFilterChange={handleSpatialFilterChange}
              primaryLayer={primaryLayer}
              secondaryLayer={secondaryLayer}
              blendMode={blendMode}
              opacity={opacity}
              setPrimaryLayer={setPrimaryLayer}
              setSecondaryLayer={setSecondaryLayer}
              setBlendMode={setBlendMode}
              setOpacity={setOpacity}
              sampleInsights={sampleInsights}
              handleApplyInsight={handleApplyInsight}
              handleRefreshInsights={handleRefreshInsights}
            />
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
