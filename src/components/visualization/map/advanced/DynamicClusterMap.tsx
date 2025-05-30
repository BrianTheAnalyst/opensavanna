
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPoint, AdvancedMapConfig } from './types';

interface DynamicClusterMapProps {
  points: MapPoint[];
  config: AdvancedMapConfig;
  currentTimeIndex: number;
  spatialAnalysis?: any;
  onConfigChange: (config: AdvancedMapConfig) => void;
}

const DynamicClusterMap: React.FC<DynamicClusterMapProps> = ({
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
    <Card className="shadow-sm border border-border/50">
      <CardContent className="p-0">
        <div className="relative h-[500px] w-full rounded-md overflow-hidden">
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            className="rounded-md z-10"
            {...{
              center: mapCenter,
              zoom: 6,
              key: `cluster-${mapCenter[0]}-${mapCenter[1]}-6`
            } as any}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {/* Cluster visualization would go here */}
          </MapContainer>
          
          {/* Info Panel - Positioned with proper spacing */}
          <div className="absolute top-4 left-4 z-20 space-y-2">
            <Card className="shadow-lg border-border/20 bg-background/95 backdrop-blur-sm">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Dynamic Clustering
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{timeFilteredPoints.length} data points</p>
                  <p className="text-muted-foreground">Radius: {config.clusterRadius}px</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicClusterMap;
