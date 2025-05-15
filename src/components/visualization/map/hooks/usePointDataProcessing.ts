
import { useState, useEffect, useMemo } from 'react';
import { LatLngExpression } from 'leaflet';
import { findGeoPoints } from '../mapUtils';
import { calculateCenterFromPoints } from '../utils/pointDataUtils';

interface PointDataProcessingResult {
  pointsData: { validPoints: any[] };
  mapCenter: LatLngExpression;
  mapZoom: number;
}

export function usePointDataProcessing(
  data: any,
  isLoading: boolean,
  hasGeoJSON: boolean
): PointDataProcessingResult {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  
  // Convert raw data to point format for map markers
  const pointsData = useMemo(() => {
    if (!data || isLoading) return { validPoints: [] };
    return findGeoPoints(data);
  }, [data, isLoading]);
  
  // For point data (when no GeoJSON)
  useEffect(() => {
    if (hasGeoJSON || isLoading || !data || !Array.isArray(data) || data.length === 0) {
      return;
    }
    
    try {
      if (pointsData.validPoints.length > 0) {
        setMapCenter(calculateCenterFromPoints(pointsData.validPoints));
        setMapZoom(5);
      }
    } catch (error) {
      console.error("Error processing geographic data points:", error);
    }
  }, [data, pointsData.validPoints, hasGeoJSON, isLoading]);

  return {
    pointsData,
    mapCenter,
    mapZoom
  };
}
