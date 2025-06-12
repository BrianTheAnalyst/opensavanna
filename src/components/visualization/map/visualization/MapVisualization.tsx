
import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Card, CardContent } from '@/components/ui/card';
import MapLoadingState from './MapLoadingState';
import MapEmptyState from './MapEmptyState';
import { useMapData } from './useMapData';
import { MapVisualizationProps, Insight } from './types';
import MapHeader from './MapHeader';
import MapContainerComponent from '../MapContainer';
import MapControls from '../MapControls';
import MapSidebar from './MapSidebar';

// Generate sample geographic data for demonstration
const generateSampleGeoData = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic') || categoryLower.includes('africa')) {
    return [
      { name: 'Lagos', lat: 6.5244, lng: 3.3792, value: 85, category: 'Major City' },
      { name: 'Cairo', lat: 30.0444, lng: 31.2357, value: 72, category: 'Capital' },
      { name: 'Cape Town', lat: -33.9249, lng: 18.4241, value: 93, category: 'Port City' },
      { name: 'Nairobi', lat: -1.2921, lng: 36.8219, value: 68, category: 'Regional Hub' }
    ];
  }
  
  return [
    { name: 'Location A', lat: 40.7128, lng: -74.0060, value: 75, category: 'Urban' },
    { name: 'Location B', lat: 34.0522, lng: -118.2437, value: 82, category: 'Metropolitan' },
    { name: 'Location C', lat: 51.5074, lng: -0.1278, value: 91, category: 'Capital' },
    { name: 'Location D', lat: 35.6762, lng: 139.6503, value: 67, category: 'Coastal' }
  ];
};

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

  // State for sidebar
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
  
  // Sample insights for insight panel
  const sampleInsights: Insight[] = [
    {
      id: '1',
      title: 'Geographic pattern detected',
      description: 'Regional clustering observed in the data distribution across major urban centers.',
      type: 'anomaly',
      confidence: 0.89,
      applied: false
    },
    {
      id: '2',
      title: 'Spatial correlation found',
      description: 'Strong geographic correlation between economic indicators and population density.',
      type: 'correlation',
      confidence: 0.76,
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
  
  // Determine what data to use for the map
  let dataToUse = data;
  if (!data || data.length === 0) {
    console.log(`No geographic data provided for ${title}, using sample data`);
    dataToUse = generateSampleGeoData(category);
  }
  
  const mapData = useMapData(dataToUse, geoJSON, isLoading);
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
    
    setTimeout(() => {
      const correlation = (Math.random() * 1.4 - 0.2).toFixed(2);
      setCorrelationValue(parseFloat(correlation));
      setIsAnalyzingCorrelation(false);
    }, 1500);
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

  // Always show the map with either real data or sample data
  return (
    <div className="space-y-6">
      <MapHeader 
        title={title} 
        description={description} 
        anomalyDetection={anomalyDetection} 
      />
      
      {/* Main Layout Container */}
      <div className="flex gap-6">
        {/* Map Container */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-full' : 'w-full lg:w-3/4'}`}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Map Controls */}
              <div className="p-4 border-b bg-muted/20">
                <MapControls
                  currentType={visualizationType}
                  setType={handleVisualizationTypeChange}
                  hasGeoJSON={!!geoJSON}
                  hasPoints={points.length > 0}
                />
              </div>
              
              {/* Map Display */}
              <div className="relative h-[500px]">
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
              </div>
              
              {/* Layer Controls */}
              <div className="p-4 border-t bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={activeLayers.includes('labels')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActiveLayers([...activeLayers, 'labels']);
                          } else {
                            setActiveLayers(activeLayers.filter(layer => layer !== 'labels'));
                          }
                        }}
                        className="rounded"
                      />
                      Show Labels
                    </label>
                  </div>
                  
                  <button
                    onClick={toggleSidebar}
                    className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
                  >
                    {sidebarCollapsed ? 'Show Controls' : 'Hide Controls'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Show notice when using sample data */}
          {(!data || data.length === 0) && (
            <div className="mt-4 bg-muted/20 border border-border rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Sample geographic data is being displayed for demonstration purposes. 
                Upload a file with geographic coordinates to see actual location data.
              </p>
            </div>
          )}
        </div>
        
        {/* Sidebar Controls */}
        {!sidebarCollapsed && (
          <div className="w-1/4 hidden lg:block">
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
    </div>
  );
};
