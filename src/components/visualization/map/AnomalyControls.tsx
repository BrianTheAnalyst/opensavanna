
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnomalyControlsProps } from './types';

const AnomalyControls: React.FC<AnomalyControlsProps> = ({ 
  anomalyDetection,
  onAnomalyToggle,
  anomalyThreshold,
  onThresholdChange
}) => {
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-primary" />
          Anomaly Detection
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="anomaly-detection" className="text-sm">
              Enable detection
            </Label>
            <Switch
              id="anomaly-detection"
              checked={anomalyDetection}
              onCheckedChange={onAnomalyToggle}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          {anomalyDetection && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="threshold-slider" className="text-sm">
                    Sensitivity (z-score threshold)
                  </Label>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
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
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">High (1.0)</span>
                  <span className="text-xs text-muted-foreground">Low (4.0)</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md border border-border/40">
                <p>Higher sensitivity (lower threshold) will detect more anomalies but may include false positives.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyControls;
