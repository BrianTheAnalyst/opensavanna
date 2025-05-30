
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MapHeader from './components/MapHeader';
import VisualizationTabs from './components/VisualizationTabs';
import ControlsGrid from './components/ControlsGrid';
import { AdvancedMapConfig } from './types';
import { useMapData } from './hooks/useMapData';
import { useSpatialAnalysis } from './hooks/useSpatialAnalysis';

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

  // Process and analyze data
  const { points, insights, patterns } = useMapData({ data, category });
  
  // Perform spatial analysis
  const { spatialAnalysis, isAnalyzing } = useSpatialAnalysis({
    points,
    showInsights: config.showInsights
  });

  // Get visualization-specific props
  const getVisualizationProps = () => ({
    points,
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
      <MapHeader
        title={title}
        description={description}
        pointsCount={points.length}
        spatialAnalysis={spatialAnalysis}
        anomalyDetection={config.anomalyDetection}
        outlierCount={patterns.outliers.length}
      />

      {/* Main visualization */}
      <VisualizationTabs
        activeVisualization={activeVisualization}
        onVisualizationChange={(value: any) => setActiveVisualization(value)}
        visualizationProps={getVisualizationProps()}
      />

      {/* Controls and Analysis */}
      <ControlsGrid
        hasTemporalData={patterns.hasTemporalData}
        timeRange={patterns.timeRange}
        currentTimeIndex={currentTimeIndex}
        onTimeChange={setCurrentTimeIndex}
        config={config}
        onConfigChange={setConfig}
        showInsights={config.showInsights}
        spatialAnalysis={spatialAnalysis}
        insights={insights}
        isAnalyzing={isAnalyzing}
        patterns={patterns}
      />
    </div>
  );
};

export default AdvancedMapVisualization;
