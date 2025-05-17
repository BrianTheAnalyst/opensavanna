
import React from 'react';
import { AlertCircle, Sliders } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AnomalyControlsProps } from './types';

const AnomalyControls: React.FC<AnomalyControlsProps> = ({
  anomalyDetection,
  onAnomalyToggle,
  anomalyThreshold,
  onThresholdChange
}) => {
  return (
    <div className="border rounded-md p-3 bg-background/90 shadow-sm">
      <div className="flex items-center mb-2">
        <AlertCircle className="h-4 w-4 mr-2" />
        <h4 className="text-sm font-medium">Anomaly Detection</h4>
      </div>
      
      <Separator className="my-2" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="anomaly-detection" className="text-xs">
            Detect Anomalies
          </Label>
          <Switch
            id="anomaly-detection"
            checked={anomalyDetection}
            onCheckedChange={onAnomalyToggle}
          />
        </div>
        
        {anomalyDetection && (
          <div className="space-y-2">
            <div className="flex items-center">
              <Sliders className="h-4 w-4 mr-2" />
              <Label htmlFor="threshold" className="text-xs">
                Sensitivity (Z-Score Threshold)
              </Label>
            </div>
            <Slider 
              id="threshold"
              min={1.0}
              max={4.0}
              step={0.1}
              defaultValue={[anomalyThreshold]}
              value={[anomalyThreshold]}
              onValueChange={(values) => onThresholdChange(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>High (1.0)</span>
              <span>{anomalyThreshold.toFixed(1)}</span>
              <span>Low (4.0)</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Lower threshold = more anomalies detected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyControls;
