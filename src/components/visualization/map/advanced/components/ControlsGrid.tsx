
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TemporalControls from '../TemporalControls';
import SpatialAnalysisPanel from '../SpatialAnalysisPanel';
import ConfigurationPanel from './ConfigurationPanel';
import { AdvancedMapConfig, DataPattern } from '../types';

interface ControlsGridProps {
  hasTemporalData: boolean;
  timeRange?: { min: number; max: number };
  currentTimeIndex: number;
  onTimeChange: (index: number) => void;
  config: AdvancedMapConfig;
  onConfigChange: (config: AdvancedMapConfig) => void;
  showInsights: boolean;
  spatialAnalysis?: any;
  insights: string[];
  isAnalyzing: boolean;
  patterns: DataPattern;
}

const ControlsGrid: React.FC<ControlsGridProps> = ({
  hasTemporalData,
  timeRange,
  currentTimeIndex,
  onTimeChange,
  config,
  onConfigChange,
  showInsights,
  spatialAnalysis,
  insights,
  isAnalyzing,
  patterns
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Analysis Controls</h3>
        <p className="text-sm text-muted-foreground">
          Configure visualization settings and explore spatial patterns
        </p>
        <Separator />
      </div>

      {/* Controls Container */}
      <div className="w-full">
        {/* First Row - Temporal and Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Temporal Controls */}
          {hasTemporalData && (
            <Card className="shadow-sm border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Temporal Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TemporalControls
                  timeRange={timeRange}
                  currentIndex={currentTimeIndex}
                  onTimeChange={onTimeChange}
                  animationEnabled={config.temporalAnimation}
                  onAnimationToggle={(enabled) => onConfigChange({ ...config, temporalAnimation: enabled })}
                />
              </CardContent>
            </Card>
          )}

          {/* Configuration Panel */}
          <div className={hasTemporalData ? '' : 'lg:col-span-2'}>
            <ConfigurationPanel config={config} onConfigChange={onConfigChange} />
          </div>
        </div>

        {/* Second Row - Spatial Analysis (Full Width) */}
        {showInsights && (
          <div className="w-full">
            <Card className="shadow-sm border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Spatial Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SpatialAnalysisPanel
                  analysis={spatialAnalysis}
                  insights={insights}
                  isAnalyzing={isAnalyzing}
                  patterns={patterns}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlsGrid;
