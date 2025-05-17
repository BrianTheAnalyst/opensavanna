
import React from 'react';
import { MapPoint } from './types';
import { Calendar, ArrowRight } from 'lucide-react';

interface TimelineItem {
  index: number;
  label: string;
  anomalyCount: number;
}

interface AnomalyTimelineProps {
  points: MapPoint[];
  labels: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({
  points,
  labels,
  currentIndex,
  onIndexChange
}) => {
  // Generate timeline items with anomaly counts for each time index
  const timelineItems = React.useMemo(() => {
    return labels.map((label, index) => {
      const pointsAtTime = points.filter(p => p.timeIndex === index);
      const anomalyCount = pointsAtTime.filter(p => p.isAnomaly).length;
      
      return {
        index,
        label,
        anomalyCount
      };
    });
  }, [points, labels]);
  
  if (labels.length <= 1) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <Calendar className="h-4 w-4 mr-2" />
        <h4 className="text-sm font-medium">Anomaly Timeline</h4>
      </div>
      
      <div className="flex items-center space-x-1 mt-2 overflow-x-auto pb-2">
        {timelineItems.map((item) => (
          <div 
            key={item.index} 
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-md cursor-pointer transition-colors min-w-[70px]
              ${currentIndex === item.index ? 'bg-primary text-primary-foreground' : 
                item.anomalyCount > 0 ? 'bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30' : 
                'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            onClick={() => onIndexChange(item.index)}
          >
            <span className="text-xs font-medium truncate max-w-[80px]">{item.label}</span>
            {item.anomalyCount > 0 && (
              <span className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${
                currentIndex === item.index 
                  ? 'bg-primary-foreground text-primary' 
                  : 'bg-red-500 text-white'
              }`}>
                {item.anomalyCount}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {currentIndex < labels.length - 1 && (
        <div 
          className="flex items-center justify-center mt-2 text-xs text-muted-foreground cursor-pointer hover:text-primary"
          onClick={() => onIndexChange(currentIndex + 1)}
        >
          <span>Next time period</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      )}
    </div>
  );
};

export default AnomalyTimeline;
