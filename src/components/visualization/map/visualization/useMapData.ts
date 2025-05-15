
import { useState, useEffect, useMemo } from 'react';
import { LatLngExpression } from 'leaflet';
import { findGeoPoints, calculateBounds } from '../mapUtils';
import { GeoDataInfo } from './types';
import { useGeoJsonWorker } from '@/hooks/dataset-visualization/useGeoJsonWorker';

export function useMapData(data: any, geoJSON: any, isLoading: boolean): GeoDataInfo & {
  pointsData: { validPoints: any[] };
  simplifiedGeoJSON: any | null;
  isSimplifying: boolean;
  processingError: string | null;
  progress: number;
} {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [processedGeoJSON, setProcessedGeoJSON] = useState<any | null>(null);
  const [simplifiedGeoJSON, setSimplifiedGeoJSON] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Use our GeoJSON worker for processing
  const { 
    processGeoJSON, 
    simplifyGeoJSON,
    isProcessing: isSimplifying,
    error: processingError
  } = useGeoJsonWorker();
  
  // Convert raw data to point format for map markers
  const pointsData = useMemo(() => {
    if (!data || isSimplifying) return { validPoints: [] };
    return findGeoPoints(data);
  }, [data, isSimplifying]);
  
  // Determine if we have geographic data
  const hasGeoData = useMemo(() => {
    return !!processedGeoJSON || !!simplifiedGeoJSON || pointsData.validPoints.length > 0;
  }, [processedGeoJSON, simplifiedGeoJSON, pointsData.validPoints.length]);
  
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
        
        // Then create a simplified version for better performance
        const simplified = await simplifyGeoJSON(geoJSON, 3);
        setSimplifiedGeoJSON(simplified);
        
        // Calculate map bounds from the GeoJSON
        if (geoJSON.features && geoJSON.features.length > 0) {
          const bounds = calculateBounds(geoJSON);
          if (bounds) {
            setMapCenter([(bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2]);
            
            // Adjust zoom based on the size of the area
            const latSpan = Math.abs(bounds.north - bounds.south);
            const lngSpan = Math.abs(bounds.east - bounds.west);
            const span = Math.max(latSpan, lngSpan);
            
            if (span < 1) setMapZoom(10);
            else if (span < 5) setMapZoom(7);
            else if (span < 20) setMapZoom(5);
            else setMapZoom(3);
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
  
  // For point data (when no GeoJSON)
  useEffect(() => {
    if (processedGeoJSON || isLoading || !data || !Array.isArray(data) || data.length === 0) {
      return;
    }
    
    try {
      if (pointsData.validPoints.length > 0) {
        // Calculate average latitude and longitude
        let sumLat = 0;
        let sumLng = 0;
        
        pointsData.validPoints.forEach(point => {
          sumLat += point.lat;
          sumLng += point.lng;
        });
        
        const avgLat = sumLat / pointsData.validPoints.length;
        const avgLng = sumLng / pointsData.validPoints.length;
        
        setMapCenter([avgLat, avgLng]);
        setMapZoom(5);
      }
    } catch (error) {
      console.error("Error processing geographic data points:", error);
    }
  }, [data, pointsData.validPoints, processedGeoJSON, isLoading]);

  return {
    hasGeoData,
    mapCenter,
    mapZoom,
    processedGeoJSON: simplifiedGeoJSON || processedGeoJSON, // Prefer simplified version
    pointsData,
    simplifiedGeoJSON,
    isSimplifying,
    processingError,
    progress
  };
}
