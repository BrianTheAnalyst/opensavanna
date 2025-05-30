
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
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
    <div className="h-full w-full rounded-md overflow-hidden">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        {...{
          center: mapCenter,
          zoom: 6,
          key: `${mapCenter[0]}-${mapCenter[1]}-6`
        } as any}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Cluster visualization would go here */}
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
          <p className="text-sm font-semibold">Dynamic Clustering</p>
          <p className="text-xs text-gray-600">{timeFilteredPoints.length} data points</p>
          <p className="text-xs text-gray-600">Radius: {config.clusterRadius}px</p>
        </div>
      </MapContainer>
    </div>
  );
};

export default DynamicClusterMap;
