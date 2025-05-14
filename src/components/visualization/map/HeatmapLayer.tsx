
import React, { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

declare module 'leaflet' {
  namespace HeatLayer {
    interface HeatLayerOptions {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      gradient?: Record<string, string>;
    }
  }

  function heatLayer(
    latlngs: Array<[number, number] | [number, number, number]>,
    options?: HeatLayer.HeatLayerOptions
  ): L.Layer;
}

interface HeatmapLayerProps {
  points: {
    lat: number;
    lng: number;
    name?: string;
    value?: number;
  }[];
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    // Check if points exist and the heat plugin is available
    if (!points || points.length === 0) return;
    if (!L.heatLayer) {
      console.error("Leaflet heat plugin is not available");
      return;
    }
    
    // Convert points to format expected by heatLayer
    const heatPoints = points.map(point => {
      // Calculate intensity - normalize to 0-1 range if possible
      let intensity = 1;
      if (point.value !== undefined) {
        // Find max value to normalize
        const maxVal = Math.max(...points.filter(p => p.value !== undefined).map(p => p.value!));
        intensity = maxVal > 0 ? point.value! / maxVal : 0.5;
      }
      
      return [point.lat, point.lng, intensity] as [number, number, number];
    });
    
    // Create and add heat layer with custom styling
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);
    
    // Cleanup
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);
  
  return null;
};

export default HeatmapLayer;
