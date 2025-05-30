
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapPoint, AdvancedMapConfig } from './types';

interface HeatmapAnalysisProps {
  points: MapPoint[];
  config: AdvancedMapConfig;
  currentTimeIndex: number;
  spatialAnalysis?: any;
  onConfigChange: (config: AdvancedMapConfig) => void;
}

const HeatmapAnalysis: React.FC<HeatmapAnalysisProps> = ({
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
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Heatmap visualization would go here */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        <p className="text-sm font-semibold">Heatmap Analysis</p>
        <p className="text-xs text-gray-600">{timeFilteredPoints.length} data points</p>
        <p className="text-xs text-gray-600">Intensity: {(config.heatmapIntensity * 100).toFixed(0)}%</p>
      </div>
    </MapContainer>
  );
};

export default HeatmapAnalysis;
