
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { TimeControlsProps } from './visualization/types';

const TimeControls: React.FC<TimeControlsProps> = ({ 
  currentIndex, 
  maxIndex = 10, 
  setCurrentIndex,
  labels
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle auto-play functionality
  React.useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 1500);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, maxIndex, setCurrentIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrev}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center flex-1">
          <span className="text-sm">
            {labels ? labels[currentIndex] : `Time Period ${currentIndex + 1}/${maxIndex + 1}`}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePlayPause}
          className="px-2 mx-1"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNext}
          className="px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Slider 
        value={[currentIndex]} 
        min={0} 
        max={maxIndex} 
        step={1} 
        onValueChange={(value) => setCurrentIndex(value[0])}
        className="w-full"
      />
    </div>
  );
};

export default TimeControls;
