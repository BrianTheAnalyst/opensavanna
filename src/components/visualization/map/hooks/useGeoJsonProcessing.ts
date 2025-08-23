
import { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';

import { useGeoJsonWorker } from '@/hooks/dataset-visualization/useGeoJsonWorker';

import { calculateMapCenter, calculateZoomLevel } from '../utils/boundsUtils';
import { calculateBounds } from '../utils/geometryUtils';
import { extractTimeSeriesInfo } from '../utils/timeSeriesDataUtils';

interface GeoJsonProcessingResult {
  processedGeoJSON: any | null;
  simplifiedGeoJSON: any | null;
  mapCenter: LatLngExpression;
  mapZoom: number;
  isSimplifying: boolean;
  processingError: string | null;
  progress: number;
  hasTimeSeriesData: boolean;
  timeLabels: string[];
}

export function useGeoJsonProcessing(
  geoJSON: any, 
  isLoading: boolean
): GeoJsonProcessingResult {
  const [processedGeoJSON, setProcessedGeoJSON] = useState<any | null>(null);
  const [simplifiedGeoJSON, setSimplifiedGeoJSON] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [progress, setProgress] = useState(0);
  const [timeSeriesInfo, setTimeSeriesInfo] = useState<{ 
    hasTimeSeriesData: boolean; 
    timeLabels: string[] 
  }>({
    hasTimeSeriesData: false,
    timeLabels: []
  });
  
  const { 
    simplifyGeoJSON,
    isProcessing: isSimplifying,
    error: processingError
  } = useGeoJsonWorker();
  
  // Process GeoJSON data with the worker
  useEffect(() => {
    if (isLoading || !geoJSON) return;
    
    // Track progress
    let progressTimer: ReturnType<typeof setInterval>;
    
    const processData = async () => {
      try {
        setProgress(10);
        
        // Start progress animation
        progressTimer = setInterval(() => {
          setProgress(prev => {
            // Only increment up to 90% - final 10% when complete
            const increment = Math.random() * 3;
            return prev < 90 ? Math.min(90, prev + increment) : prev;
          });
        }, 200);
        
        // First set the full GeoJSON for accurate processing
        setProcessedGeoJSON(geoJSON);
        
        // Extract time series information
        const timeInfo = extractTimeSeriesInfo(geoJSON);
        setTimeSeriesInfo(timeInfo);
        
        // Then create a simplified version for better performance
        const simplified = await simplifyGeoJSON(geoJSON, 3);
        setSimplifiedGeoJSON(simplified);
        
        // Calculate map bounds from the GeoJSON
        if (geoJSON.features && geoJSON.features.length > 0) {
          const bounds = calculateBounds(geoJSON);
          if (bounds) {
            setMapCenter(calculateMapCenter(bounds));
            setMapZoom(calculateZoomLevel(bounds));
          }
        }
        
        // Processing complete
        setProgress(100);
      } catch (error) {
        console.error("Error processing GeoJSON:", error);
      } finally {
        clearInterval(progressTimer);
      }
    };
    
    processData();
    
    return () => {
      clearInterval(progressTimer);
    };
  }, [geoJSON, isLoading, simplifyGeoJSON]);

  return {
    processedGeoJSON,
    simplifiedGeoJSON,
    mapCenter,
    mapZoom,
    isSimplifying,
    processingError,
    progress,
    hasTimeSeriesData: timeSeriesInfo.hasTimeSeriesData,
    timeLabels: timeSeriesInfo.timeLabels
  };
}
