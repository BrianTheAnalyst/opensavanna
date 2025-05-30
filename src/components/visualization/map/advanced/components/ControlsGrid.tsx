
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Temporal Controls */}
      {hasTemporalData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Temporal Analysis</CardTitle>
          </CardHeader>
          <CardContent>
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
      <ConfigurationPanel config={config} onConfigChange={onConfigChange} />

      {/* Spatial Analysis Panel */}
      {showInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spatial Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <SpatialAnalysisPanel
              analysis={spatialAnalysis}
              insights={insights}
              isAnalyzing={isAnalyzing}
              patterns={patterns}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ControlsGrid;
