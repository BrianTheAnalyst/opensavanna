
import React from 'react';

import { Badge } from '@/components/ui/badge';

interface MapHeaderProps {
  title: string;
  description: string;
  anomalyDetection: boolean;
}

const MapHeader: React.FC<MapHeaderProps> = ({ title, description, anomalyDetection }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Badge variant="outline" className="bg-primary/10">
        {anomalyDetection ? 'Anomaly Detection: On' : 'Standard View'}
      </Badge>
    </div>
  );
};

export default MapHeader;
