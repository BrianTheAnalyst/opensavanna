
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Target, Activity, BarChart3 } from 'lucide-react';
import IntelligentChoroplethMap from '../IntelligentChoroplethMap';
import DynamicClusterMap from '../DynamicClusterMap';
import HeatmapAnalysis from '../HeatmapAnalysis';
import FlowMap from '../FlowMap';
import { MapPoint, AdvancedMapConfig } from '../types';

interface VisualizationTabsProps {
  activeVisualization: 'choropleth' | 'cluster' | 'heatmap' | 'flow';
  onVisualizationChange: (value: string) => void;
  visualizationProps: {
    points: MapPoint[];
    geoJSON?: any;
    config: AdvancedMapConfig;
    currentTimeIndex: number;
    spatialAnalysis?: any;
    onConfigChange: (config: AdvancedMapConfig) => void;
  };
}

const VisualizationTabs: React.FC<VisualizationTabsProps> = ({
  activeVisualization,
  onVisualizationChange,
  visualizationProps
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <Tabs value={activeVisualization} onValueChange={onVisualizationChange}>
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
              <IntelligentChoroplethMap {...visualizationProps} />
            </TabsContent>
            
            <TabsContent value="cluster" className="h-full m-0">
              <DynamicClusterMap {...visualizationProps} />
            </TabsContent>
            
            <TabsContent value="heatmap" className="h-full m-0">
              <HeatmapAnalysis {...visualizationProps} />
            </TabsContent>
            
            <TabsContent value="flow" className="h-full m-0">
              <FlowMap {...visualizationProps} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationTabs;
