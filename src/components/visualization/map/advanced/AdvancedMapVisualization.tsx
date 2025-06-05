
import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

const LoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Globe className="h-16 w-16 mx-auto text-muted-foreground animate-spin" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Loading Map Visualization</p>
              <p className="text-sm text-muted-foreground">Processing geographic data...</p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

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
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="w-full">
          <MapHeader
            title={title}
            description={description}
            pointsCount={points.length}
            spatialAnalysis={spatialAnalysis}
            anomalyDetection={config.anomalyDetection}
            outlierCount={patterns.outliers.length}
          />
        </div>

        {/* Main Visualization Section */}
        <div className="w-full">
          <VisualizationTabs
            activeVisualization={activeVisualization}
            onVisualizationChange={(value: any) => setActiveVisualization(value)}
            visualizationProps={getVisualizationProps()}
          />
        </div>

        {/* Controls Section */}
        <div className="w-full mt-8">
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
      </div>
    </div>
  );
};

export default AdvancedMapVisualization;
