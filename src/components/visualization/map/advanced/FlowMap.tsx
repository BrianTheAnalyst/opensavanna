
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPoint, AdvancedMapConfig } from './types';

interface FlowMapProps {
  points: MapPoint[];
  config: AdvancedMapConfig;
  currentTimeIndex: number;
  spatialAnalysis?: any;
  onConfigChange: (config: AdvancedMapConfig) => void;
}

const FlowMap: React.FC<FlowMapProps> = ({
  points,
  config,
  currentTimeIndex,
  spatialAnalysis
}) => {
  // Filter points by time if temporal data exists
  const timeFilteredPoints = useMemo(() => {
    return points.filter(point => 
      point.timeIndex === undefined || point.timeIndex === currentTimeIndex
    );
  }, [points, currentTimeIndex]);

  // Calculate center of map
  const mapCenter = useMemo(() => {
    if (timeFilteredPoints.length === 0) return [20, 0] as [number, number];
    
    const avgLat = timeFilteredPoints.reduce((sum, p) => sum + p.lat, 0) / timeFilteredPoints.length;
    const avgLng = timeFilteredPoints.reduce((sum, p) => sum + p.lng, 0) / timeFilteredPoints.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [timeFilteredPoints]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 rounded-lg overflow-hidden border border-border/30">
        <MapContainer
          style={{ height: '100%', width: '100%' }}
          className="z-10"
          {...{
            center: mapCenter,
            zoom: 6,
            key: `flow-${mapCenter[0]}-${mapCenter[1]}-6`
          } as any}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Flow visualization would go here */}
        </MapContainer>
      </div>
      
      {/* Info Panel */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="shadow-lg border-border/20 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Flow Analysis
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{timeFilteredPoints.length} data points</p>
              <p className="text-muted-foreground">Flow patterns and connections</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlowMap;
