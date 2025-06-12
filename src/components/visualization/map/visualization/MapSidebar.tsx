
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AnomalyControls from '../AnomalyControls';
import CorrelationPanel from '../CorrelationPanel';
import SpatialFilterPanel from '../SpatialFilterPanel';
import LayerBlendingControls from '../LayerBlendingControls';
import InsightSuggestionPanel from '../InsightSuggestionPanel';
import { Insight } from './types';

interface MapSidebarProps {
  anomalyDetection: boolean;
  anomalyThreshold: number;
  handleAnomalyToggle: (enabled: boolean) => void;
  handleThresholdChange: (value: number) => void;
  availableLayers: Array<{id: string, name: string, category: string}>;
  correlationValue: number | null;
  isAnalyzingCorrelation: boolean;
  handleAnalyzeCorrelation: (variable1: string, variable2: string) => void;
  sampleRegions: Array<{id: string, name: string}>;
  handleSpatialFilterChange: (filter: any) => void;
  primaryLayer: string;
  secondaryLayer: string;
  blendMode: string;
  opacity: number;
  setPrimaryLayer: (layer: string) => void;
  setSecondaryLayer: (layer: string) => void;
  setBlendMode: (mode: string) => void;
  setOpacity: (opacity: number) => void;
  sampleInsights: Insight[];
  handleApplyInsight: (insightId: string) => void;
  handleRefreshInsights: () => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({
  anomalyDetection,
  anomalyThreshold,
  handleAnomalyToggle,
  handleThresholdChange,
  availableLayers,
  correlationValue,
  isAnalyzingCorrelation,
  handleAnalyzeCorrelation,
  sampleRegions,
  handleSpatialFilterChange,
  primaryLayer,
  secondaryLayer,
  blendMode,
  opacity,
  setPrimaryLayer,
  setSecondaryLayer,
  setBlendMode,
  setOpacity,
  sampleInsights,
  handleApplyInsight,
  handleRefreshInsights
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Map Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-4">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MapSidebar;
