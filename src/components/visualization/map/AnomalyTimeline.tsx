
import React from 'react';
import { Timeline, Circle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPoint } from './types';

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
  if (!points || points.length === 0 || !labels || labels.length === 0) {
    return null;
  }

  // Group points by time index and count anomalies
  const timeIndexMap = new Map<number, { total: number; anomalies: number }>();
  
  points.forEach(point => {
    const timeIndex = point.timeIndex !== undefined ? point.timeIndex : 0;
    const isAnomaly = !!point.isAnomaly;
    
    if (!timeIndexMap.has(timeIndex)) {
      timeIndexMap.set(timeIndex, { total: 0, anomalies: 0 });
    }
    
    const current = timeIndexMap.get(timeIndex)!;
    current.total += 1;
    if (isAnomaly) {
      current.anomalies += 1;
    }
  });
  
  // Create timeline items (limit to the number of available labels)
  const timelineItems = Array.from(
    { length: Math.min(labels.length, Math.max(...Array.from(timeIndexMap.keys())) + 1) },
    (_, i) => {
      const stats = timeIndexMap.get(i) || { total: 0, anomalies: 0 };
      return {
        index: i,
        label: labels[i] || `Time ${i + 1}`,
        anomalyCount: stats.anomalies,
        totalCount: stats.total,
        hasAnomalies: stats.anomalies > 0
      };
    }
  );

  return (
    <Card className="mb-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardContent className="py-4">
        <div className="flex items-center mb-2 gap-2">
          <Timeline className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Anomaly Timeline</h3>
          <div className="ml-auto text-xs text-muted-foreground">
            {timelineItems[currentIndex]?.anomalyCount || 0} anomalies detected
          </div>
        </div>
        
        <div className="flex items-center overflow-x-auto py-1 gap-1">
          {timelineItems.map((item) => (
            <Button
              key={item.index}
              variant={item.index === currentIndex ? 'default' : 'outline'}
              size="sm"
              className={`
                flex-shrink-0 rounded-full px-3
                ${item.hasAnomalies && item.index !== currentIndex ? 'border-red-300 text-red-600 dark:border-red-800 dark:text-red-400' : ''}
              `}
              onClick={() => onIndexChange(item.index)}
            >
              {item.hasAnomalies ? (
                <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
              ) : (
                <Circle className="h-3 w-3 mr-1" />
              )}
              {item.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyTimeline;
