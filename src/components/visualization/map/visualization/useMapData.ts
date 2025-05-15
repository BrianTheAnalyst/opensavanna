
import { useState, useEffect } from 'react';
import { LatLngExpression } from 'leaflet';
import { findGeoPoints, calculateBounds } from '../mapUtils';
import { GeoDataInfo } from './types';

export function useMapData(data: any, geoJSON: any, isLoading: boolean): GeoDataInfo & {
  pointsData: { validPoints: any[] };
} {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [processedGeoJSON, setProcessedGeoJSON] = useState<any | null>(null);
  
  // Process data for map visualization
  useEffect(() => {
    if (isLoading) return;
    
    try {
      // If we have direct GeoJSON data
      if (geoJSON) {
        setProcessedGeoJSON(geoJSON);
        
        // Try to center the map on the data
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
      }
      // If we have data with lat/lng properties
      else if (data && Array.isArray(data) && data.length > 0) {
        const pointsData = findGeoPoints(data);
        
        if (pointsData.validPoints.length > 0) {
          // Calculate average latitude and longitude correctly
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
      }
    } catch (error) {
      console.error("Error processing geographic data:", error);
    }
  }, [data, geoJSON, isLoading]);

  // Find point data (if no GeoJSON)
  const pointsData = !processedGeoJSON && data ? findGeoPoints(data) : { validPoints: [] };
  const hasGeoData = !!processedGeoJSON || pointsData.validPoints.length > 0;

  return {
    hasGeoData,
    mapCenter,
    mapZoom,
    processedGeoJSON,
    pointsData
  };
}
