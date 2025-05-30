import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Map, 
  Layers, 
  TrendingUp, 
  Zap, 
  Target,
  Activity,
  BarChart3,
  Globe
} from 'lucide-react';
import IntelligentChoroplethMap from './IntelligentChoroplethMap';
import DynamicClusterMap from './DynamicClusterMap';
import HeatmapAnalysis from './HeatmapAnalysis';
import FlowMap from './FlowMap';
import SpatialAnalysisPanel from './SpatialAnalysisPanel';
import TemporalControls from './TemporalControls';
import { MapPoint, AdvancedMapConfig } from './types';
import { analyzeSpatialData } from './utils/spatialAnalyzer';
import { detectDataPatterns } from './utils/patternDetection';

interface AdvancedMapVisualizationProps {
  data: any[];
  geoJSON?: any;
  title: string;
  description: string;
  category: string;
  isLoading?: boolean;
}

const AdvancedMapVisualization: React.FC<AdvancedMapVisualizationProps> = ({
  data,
  geoJSON,
  title,
  description,
  category,
  isLoading = false
}) => {
  // State management
  const [activeVisualization, setActiveVisualization] = useState<'choropleth' | 'cluster' | 'heatmap' | 'flow'>('choropleth');
  const [config, setConfig] = useState<AdvancedMapConfig>({
    colorScheme: 'viridis',
    clusterRadius: 50,
    heatmapIntensity: 0.8,
    anomalyDetection: true,
    temporalAnimation: false,
    showInsights: true,
    spatialSmoothing: true,
    dataLayers: ['primary']
  });
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [spatialAnalysis, setSpatialAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Process and analyze data
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { points: [], insights: [], patterns: { clusters: [], outliers: [], hasTemporalData: false, correlations: [] } };
    
    // Convert data to standardized map points
    const points: MapPoint[] = data.map((item, index) => ({
      id: `point-${index}`,
      lat: item.lat || item.latitude || 0,
      lng: item.lng || item.longitude || 0,
      value: item.value || item.data || Math.random() * 100,
      properties: {
        name: item.name || `Location ${index + 1}`,
        category: item.category || category,
        ...item
      },
      timeIndex: item.timeIndex || item.year || 0
    })).filter(point => point.lat !== 0 && point.lng !== 0);
    
    // Detect patterns in the data
    const patterns = detectDataPatterns(points);
    
    // Generate insights based on patterns
    const insights = [
      `Analyzed ${points.length} geographic data points`,
      `Detected ${patterns.clusters.length} distinct spatial clusters`,
      `Found ${patterns.outliers.length} anomalous data points`,
      patterns.hasTemporalData ? `Temporal data spans ${patterns.timeRange?.max - patterns.timeRange?.min} time periods` : 'Static geographic data',
      `Primary data concentration in ${patterns.dominantRegion || 'distributed pattern'}`
    ];
    
    return { points, insights, patterns };
  }, [data, category]);

  // Perform spatial analysis
  useEffect(() => {
    if (processedData.points.length > 0 && config.showInsights) {
      setIsAnalyzing(true);
      analyzeSpatialData(processedData.points)
        .then(analysis => {
          setSpatialAnalysis(analysis);
          setIsAnalyzing(false);
        })
        .catch(error => {
          console.error('Spatial analysis failed:', error);
          setIsAnalyzing(false);
        });
    }
  }, [processedData.points, config.showInsights]);

  // Get visualization-specific props
  const getVisualizationProps = () => ({
    points: processedData.points,
    geoJSON,
    config,
    currentTimeIndex,
    spatialAnalysis,
    onConfigChange: setConfig
  });

  if (isLoading) {
    return (
      <Card className="h-[600px] animate-pulse">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">Loading advanced map visualization...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with insights */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Map className="h-6 w-6 text-primary" />
                {title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {processedData.points.length} Points
              </Badge>
              {spatialAnalysis && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Moran's I: {spatialAnalysis.moransI?.toFixed(3)}
                </Badge>
              )}
              {config.anomalyDetection && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {processedData.patterns.outliers.length} Anomalies
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main visualization */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <Tabs value={activeVisualization} onValueChange={(value: any) => setActiveVisualization(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="choropleth" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Choropleth
              </TabsTrigger>
              <TabsTrigger value="cluster" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Clusters
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="flow" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Flow
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-[500px] relative">
            <Tabs value={activeVisualization}>
              <TabsContent value="choropleth" className="h-full m-0">
                <IntelligentChoroplethMap {...getVisualizationProps()} />
              </TabsContent>
              
              <TabsContent value="cluster" className="h-full m-0">
                <DynamicClusterMap {...getVisualizationProps()} />
              </TabsContent>
              
              <TabsContent value="heatmap" className="h-full m-0">
                <HeatmapAnalysis {...getVisualizationProps()} />
              </TabsContent>
              
              <TabsContent value="flow" className="h-full m-0">
                <FlowMap {...getVisualizationProps()} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Controls and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temporal Controls */}
        {processedData.patterns.hasTemporalData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Temporal Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <TemporalControls
                timeRange={processedData.patterns.timeRange}
                currentIndex={currentTimeIndex}
                onTimeChange={setCurrentTimeIndex}
                animationEnabled={config.temporalAnimation}
                onAnimationToggle={(enabled) => setConfig(prev => ({ ...prev, temporalAnimation: enabled }))}
              />
            </CardContent>
          </Card>
        )}

        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visualization Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="anomaly-detection">Anomaly Detection</Label>
              <Switch
                id="anomaly-detection"
                checked={config.anomalyDetection}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, anomalyDetection: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="spatial-smoothing">Spatial Smoothing</Label>
              <Switch
                id="spatial-smoothing"
                checked={config.spatialSmoothing}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, spatialSmoothing: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cluster Radius: {config.clusterRadius}km</Label>
              <Slider
                value={[config.clusterRadius]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, clusterRadius: value }))}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Heatmap Intensity: {(config.heatmapIntensity * 100).toFixed(0)}%</Label>
              <Slider
                value={[config.heatmapIntensity]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, heatmapIntensity: value }))}
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Spatial Analysis Panel */}
        {config.showInsights && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spatial Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <SpatialAnalysisPanel
                analysis={spatialAnalysis}
                insights={processedData.insights}
                isAnalyzing={isAnalyzing}
                patterns={processedData.patterns}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdvancedMapVisualization;
