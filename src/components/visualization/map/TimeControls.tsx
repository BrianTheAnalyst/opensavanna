
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';

interface TimeControlsProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  labels?: string[];
  interval?: number;
}

const TimeControls: React.FC<TimeControlsProps> = ({
  currentIndex,
  setCurrentIndex,
  labels = [],
  interval = 1500
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const max = Math.max(labels.length - 1, 0);
  
  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      // Instead of using a function, we'll read the current value and calculate the new one
      const nextIndex = currentIndex >= max ? currentIndex : currentIndex + 1;
      if (nextIndex >= max) {
        setIsPlaying(false);
      }
      setCurrentIndex(nextIndex);
    }, interval);
    
    return () => clearInterval(timer);
  }, [isPlaying, max, interval, setCurrentIndex, currentIndex]);
  
  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(Math.min(max, currentIndex + 1));
  };
  
  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(value[0]);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full px-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">
          {labels[currentIndex] || `Time period ${currentIndex + 1}`}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleNext}
            disabled={currentIndex >= max}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Slider
        value={[currentIndex]}
        min={0}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
      />
    </div>
  );
};

export default TimeControls;
