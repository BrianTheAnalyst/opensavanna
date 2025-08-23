
import { LatLngExpression } from 'leaflet';
import { useState, useMemo, useCallback } from 'react';


import { useGeoJsonProcessing } from '../hooks/useGeoJsonProcessing';
import { usePointDataProcessing } from '../hooks/usePointDataProcessing';

import { GeoDataInfo } from './types';

export function useMapData(data: any, geoJSON: any, isLoading: boolean): GeoDataInfo & {
  pointsData: { validPoints: any[] };
  simplifiedGeoJSON: any | null;
  isSimplifying: boolean;
  processingError: string | null;
  progress: number;
  hasTimeSeriesData: boolean;
  timeLabels: string[];
} {
  // Use the geo JSON processing hook
  const {
    processedGeoJSON,
    simplifiedGeoJSON,
    mapCenter: geoJsonCenter,
    mapZoom: geoJsonZoom,
    isSimplifying,
    processingError,
    progress,
    hasTimeSeriesData,
    timeLabels
  } = useGeoJsonProcessing(geoJSON, isLoading);
  
  // Use the point data processing hook
  const {
    pointsData,
    mapCenter: pointDataCenter,
    mapZoom: pointDataZoom
  } = usePointDataProcessing(data, isLoading, !!processedGeoJSON);
  
  // Determine final map center and zoom
  const mapCenter = useMemo<LatLngExpression>(() => {
    return processedGeoJSON ? geoJsonCenter : pointDataCenter;
  }, [processedGeoJSON, geoJsonCenter, pointDataCenter]);
  
  const mapZoom = useMemo(() => {
    return processedGeoJSON ? geoJsonZoom : pointDataZoom;
  }, [processedGeoJSON, geoJsonZoom, pointDataZoom]);
  
  // Determine if we have geographic data
  const hasGeoData = useMemo(() => {
    return !!processedGeoJSON || !!simplifiedGeoJSON || pointsData.validPoints.length > 0;
  }, [processedGeoJSON, simplifiedGeoJSON, pointsData.validPoints.length]);
  
  // Add caching for improved performance when dealing with large datasets
  const cachedGeoJSON = useMemo(() => {
    return simplifiedGeoJSON || processedGeoJSON;
  }, [simplifiedGeoJSON, processedGeoJSON]);

  return {
    hasGeoData,
    mapCenter,
    mapZoom,
    processedGeoJSON: cachedGeoJSON, // Use memoized version for better performance
    pointsData,
    simplifiedGeoJSON,
    isSimplifying,
    processingError,
    progress,
    hasTimeSeriesData,
    timeLabels
  };
}
