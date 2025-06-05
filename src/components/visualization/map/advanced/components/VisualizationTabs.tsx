
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
    <div className="w-full">
      <Card className="shadow-lg border border-border/50">
        <CardHeader className="pb-4">
          <Tabs value={activeVisualization} onValueChange={onVisualizationChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="choropleth" className="flex items-center gap-2 h-10">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Choropleth</span>
              </TabsTrigger>
              <TabsTrigger value="cluster" className="flex items-center gap-2 h-10">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Clusters</span>
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2 h-10">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Heatmap</span>
              </TabsTrigger>
              <TabsTrigger value="flow" className="flex items-center gap-2 h-10">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Flow</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="w-full">
            <Tabs value={activeVisualization}>
              <TabsContent value="choropleth" className="m-0 w-full">
                <div className="w-full h-[600px]">
                  <IntelligentChoroplethMap {...visualizationProps} />
                </div>
              </TabsContent>
              
              <TabsContent value="cluster" className="m-0 w-full">
                <div className="w-full h-[600px]">
                  <DynamicClusterMap {...visualizationProps} />
                </div>
              </TabsContent>
              
              <TabsContent value="heatmap" className="m-0 w-full">
                <div className="w-full h-[600px]">
                  <HeatmapAnalysis {...visualizationProps} />
                </div>
              </TabsContent>
              
              <TabsContent value="flow" className="m-0 w-full">
                <div className="w-full h-[600px]">
                  <FlowMap {...visualizationProps} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizationTabs;
