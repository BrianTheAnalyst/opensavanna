
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface TimeControlsProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  labels: string[];
}

const TimeControls: React.FC<TimeControlsProps> = ({ 
  currentIndex, 
  setCurrentIndex,
  labels = [] 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState<number | null>(null);
  
  // Total number of time steps (accounting for 0-indexing)
  const totalTimeSteps = labels.length - 1;
  
  // Get the current time label or default value
  const currentTimeLabel = labels[currentIndex] || 'N/A';
  
  // Effect to handle cleanup of interval when component unmounts
  useEffect(() => {
    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, [playInterval]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      // Stop playing
      if (playInterval) clearInterval(playInterval);
      setPlayInterval(null);
      setIsPlaying(false);
    } else {
      // Start playing
      const interval = window.setInterval(() => {
        // Instead of using a callback function that TypeScript doesn't like,
        // get the current index and calculate the next one directly
        const nextIndex = currentIndex < totalTimeSteps ? currentIndex + 1 : 0;
        setCurrentIndex(nextIndex);
      }, 1500);
      setPlayInterval(interval as unknown as number);
      setIsPlaying(true);
    }
  };
  
  // Handle stepping forward
  const stepForward = () => {
    const nextIndex = currentIndex < totalTimeSteps ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
  };
  
  // Handle stepping backward
  const stepBackward = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalTimeSteps;
    setCurrentIndex(prevIndex);
  };
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(value[0]);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Time: {currentTimeLabel}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={stepBackward}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={togglePlay}
          >
            {isPlaying ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />}
          </Button>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={stepForward}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Slider
        value={[currentIndex]}
        max={totalTimeSteps}
        step={1}
        onValueChange={handleSliderChange}
      />
    </div>
  );
};

export default TimeControls;
