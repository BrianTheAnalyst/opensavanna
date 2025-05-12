
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimeControlsProps {
  timeData?: {
    labels: string[];
    min: number;
    max: number;
  };
  onTimeChange: (timeIndex: number) => void;
}

const TimeControls: React.FC<TimeControlsProps> = ({ timeData, onTimeChange }) => {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState<number | null>(null);

  // If no time data is available, don't render the component
  if (!timeData || timeData.labels.length <= 1) return null;

  const timeLabels = timeData.labels;
  const totalTimeSteps = timeLabels.length - 1;
  
  const handleTimeChange = (values: number[]) => {
    const newIndex = Math.round(values[0]);
    setCurrentTimeIndex(newIndex);
    onTimeChange(newIndex);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Stop playing
      if (playInterval !== null) {
        window.clearInterval(playInterval);
        setPlayInterval(null);
      }
      setIsPlaying(false);
    } else {
      // Start playing
      const interval = window.setInterval(() => {
        setCurrentTimeIndex(prev => {
          const nextIndex = prev < totalTimeSteps ? prev + 1 : 0;
          onTimeChange(nextIndex);
          return nextIndex;
        });
      }, 1500);
      setPlayInterval(interval as unknown as number);
      setIsPlaying(true);
    }
  };

  const handleStepBack = () => {
    const newIndex = currentTimeIndex > 0 ? currentTimeIndex - 1 : totalTimeSteps;
    setCurrentTimeIndex(newIndex);
    onTimeChange(newIndex);
  };

  const handleStepForward = () => {
    const newIndex = currentTimeIndex < totalTimeSteps ? currentTimeIndex + 1 : 0;
    setCurrentTimeIndex(newIndex);
    onTimeChange(newIndex);
  };

  // Clean up interval when component unmounts
  React.useEffect(() => {
    return () => {
      if (playInterval !== null) {
        window.clearInterval(playInterval);
      }
    };
  }, [playInterval]);
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Time period:</span>
        <span className="text-sm font-medium">{timeLabels[currentTimeIndex]}</span>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleStepBack}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handlePlayPause}
          >
            {isPlaying ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />
            }
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleStepForward}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-2">
          <Slider 
            className="w-full"
            min={0}
            max={totalTimeSteps}
            step={1}
            value={[currentTimeIndex]}
            onValueChange={handleTimeChange}
          />
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {timeLabels[0]} - {timeLabels[totalTimeSteps]}
        </div>
      </div>
    </div>
  );
};

export default TimeControls;
