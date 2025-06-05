
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Target, TrendingUp, Zap } from 'lucide-react';

interface MapHeaderProps {
  title: string;
  description: string;
  pointsCount: number;
  spatialAnalysis?: any;
  anomalyDetection: boolean;
  outlierCount: number;
}

const MapHeader: React.FC<MapHeaderProps> = ({
  title,
  description,
  pointsCount,
  spatialAnalysis,
  anomalyDetection,
  outlierCount
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Map className="h-6 w-6 text-primary" />
              {title}
            </CardTitle>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {pointsCount} Points
            </Badge>
            {spatialAnalysis && (
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Moran's I: {spatialAnalysis.moransI?.toFixed(3)}
              </Badge>
            )}
            {anomalyDetection && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {outlierCount} Anomalies
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MapHeader;
