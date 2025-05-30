
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AdvancedMapConfig } from '../types';

interface ConfigurationPanelProps {
  config: AdvancedMapConfig;
  onConfigChange: (config: AdvancedMapConfig) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onConfigChange
}) => {
  return (
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
            onCheckedChange={(checked) => onConfigChange({ ...config, anomalyDetection: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="spatial-smoothing">Spatial Smoothing</Label>
          <Switch
            id="spatial-smoothing"
            checked={config.spatialSmoothing}
            onCheckedChange={(checked) => onConfigChange({ ...config, spatialSmoothing: checked })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Cluster Radius: {config.clusterRadius}km</Label>
          <Slider
            value={[config.clusterRadius]}
            onValueChange={([value]) => onConfigChange({ ...config, clusterRadius: value })}
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
            onValueChange={([value]) => onConfigChange({ ...config, heatmapIntensity: value })}
            max={1}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationPanel;
