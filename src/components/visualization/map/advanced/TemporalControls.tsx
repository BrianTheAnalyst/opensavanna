
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TemporalControlsProps {
  timeRange?: { min: number; max: number };
  currentIndex: number;
  onTimeChange: (index: number) => void;
  animationEnabled: boolean;
  onAnimationToggle: (enabled: boolean) => void;
}

const TemporalControls: React.FC<TemporalControlsProps> = ({
  timeRange,
  currentIndex,
  onTimeChange,
  animationEnabled,
  onAnimationToggle
}) => {
  if (!timeRange) {
    return (
      <div className="text-center text-muted-foreground">
        <p className="text-sm">No temporal data available</p>
      </div>
    );
  }

  const totalSteps = timeRange.max - timeRange.min + 1;

  const handleReset = () => {
    onTimeChange(0);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Time Period: {timeRange.min + currentIndex}</Label>
        <Slider
          value={[currentIndex]}
          onValueChange={([value]) => onTimeChange(value)}
          max={totalSteps - 1}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{timeRange.min}</span>
          <span>{timeRange.max}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="animation"
            checked={animationEnabled}
            onCheckedChange={onAnimationToggle}
          />
          <Label htmlFor="animation" className="text-sm">Auto-play</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAnimationToggle(!animationEnabled)}
          >
            {animationEnabled ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Step {currentIndex + 1} of {totalSteps}</p>
        <p>Use animation controls to see temporal patterns</p>
      </div>
    </div>
  );
};

export default TemporalControls;
