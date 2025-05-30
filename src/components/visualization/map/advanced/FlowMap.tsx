
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Flow visualization would go here */}
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
          <p className="text-sm font-semibold">Flow Analysis</p>
          <p className="text-xs text-gray-600">{timeFilteredPoints.length} data points</p>
          <p className="text-xs text-gray-600">Flow patterns and connections</p>
        </div>
      </MapContainer>
    </div>
  );
};

export default FlowMap;
