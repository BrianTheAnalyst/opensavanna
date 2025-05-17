
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
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
        <AlertCircle className="h-4 w-4 mr-2 text-primary" />
        <h4 className="text-sm font-medium">Anomaly Detection</h4>
      </div>
      <Separator className="my-2" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="anomaly-detection" className="text-xs">
            Enable detection
          </Label>
          <Switch
            id="anomaly-detection"
            checked={anomalyDetection}
            onCheckedChange={onAnomalyToggle}
          />
        </div>
        
        {anomalyDetection && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="threshold-slider" className="text-xs">
                  Sensitivity (z-score threshold)
                </Label>
                <span className="text-xs text-muted-foreground">
                  {anomalyThreshold.toFixed(1)}
                </span>
              </div>
              <Slider
                id="threshold-slider"
                min={1}
                max={4}
                step={0.1}
                value={[anomalyThreshold]}
                onValueChange={(value) => onThresholdChange(value[0])}
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">High (1.0)</span>
                <span className="text-xs text-muted-foreground">Low (4.0)</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
              <p>Higher sensitivity (lower threshold) will detect more anomalies but may include false positives.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnomalyControls;
