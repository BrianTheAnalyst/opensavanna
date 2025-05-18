
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface TimeControlsProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  maxIndex?: number;
  labels?: string[];
  interval?: number;
}

const TimeControls: React.FC<TimeControlsProps> = ({
  currentIndex,
  setCurrentIndex,
  maxIndex: propMaxIndex,
  labels = [],
  interval = 1500
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Use the provided maxIndex or calculate from labels length, defaulting to 0
  const max = propMaxIndex !== undefined ? propMaxIndex : Math.max(labels.length - 1, 0);
  
  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev >= max ? 0 : prev + 1; // Loop back to beginning when reaching the end
        if (nextIndex === 0 && prev === max) {
          setIsPlaying(false); // Optional: Stop playing when it loops back to start
        }
        return nextIndex;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [isPlaying, max, interval, setCurrentIndex]);
  
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
    <div className="flex flex-col space-y-3 w-full px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          {labels[currentIndex] || `Time period ${currentIndex + 1}`}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border border-border/40 transition-colors hover:bg-primary/10" 
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isPlaying ? "default" : "outline"}
            size="icon" 
            className={`h-8 w-8 rounded-full border transition-all ${isPlaying ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border border-border/40 transition-colors hover:bg-primary/10" 
            onClick={handleNext}
            disabled={currentIndex >= max}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative px-1 py-2">
        <Slider
          value={[currentIndex]}
          min={0}
          max={max}
          step={1}
          onValueChange={handleSliderChange}
          className="cursor-pointer"
        />
        
        {/* Time markers */}
        <div className="flex justify-between mt-1 px-1">
          {Array.from({ length: Math.min(5, max + 1) }).map((_, i) => {
            const position = i === 0 ? 0 : i === 4 ? max : Math.round((max / 4) * i);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-1 h-1 rounded-full ${currentIndex === position ? 'bg-primary' : 'bg-muted-foreground/50'}`}></div>
                <span className="text-xs text-muted-foreground mt-1">
                  {labels[position] || `T${position + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeControls;
