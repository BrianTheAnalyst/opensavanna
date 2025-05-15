
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimeControlsProps {
  currentIndex: number;
  setCurrentIndex: (timeIndex: number) => void;
  labels: string[];
}

const TimeControls: React.FC<TimeControlsProps> = ({ currentIndex, setCurrentIndex, labels }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState<number | null>(null);

  // If no time data is available, don't render the component
  if (!labels || labels.length <= 1) return null;

  const totalTimeSteps = labels.length - 1;
  
  const handleTimeChange = (values: number[]) => {
    const newIndex = Math.round(values[0]);
    setCurrentIndex(newIndex);
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
        setCurrentIndex((prev) => prev < totalTimeSteps ? prev + 1 : 0);
      }, 1500);
      setPlayInterval(interval as unknown as number);
      setIsPlaying(true);
    }
  };

  const handleStepBack = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : totalTimeSteps;
    setCurrentIndex(newIndex);
  };

  const handleStepForward = () => {
    const newIndex = currentIndex < totalTimeSteps ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
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
        <span className="text-sm font-medium">{labels[currentIndex]}</span>
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
            value={[currentIndex]}
            onValueChange={handleTimeChange}
          />
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {labels[0]} - {labels[totalTimeSteps]}
        </div>
      </div>
    </div>
  );
};

export default TimeControls;
