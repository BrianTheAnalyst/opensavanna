
import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
// Fix TypeScript error by using declaration merging
// instead of module augmentation (which was causing the error)
declare global {
  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }
}

interface HeatmapLayerProps {
  points: Array<{
    lat: number;
    lng: number;
    value?: number;
    weight?: number;
  }>;
  radius?: number;
  blur?: number;
  max?: number;
  gradient?: Record<number, string>;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  points,
  radius = 25,
  blur = 15,
  max = 1.0,
  gradient = { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
}) => {
  const map = useMap();
  const [heatLayer, setHeatLayer] = useState<any>(null);
  
  useEffect(() => {
    // Remove existing layer if there is one
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }
    
    if (points && points.length > 0) {
      // Format points for heatmap
      const heatPoints = points.map(p => {
        const intensity = p.value !== undefined ? p.value : (p.weight !== undefined ? p.weight : 1);
        return [p.lat, p.lng, intensity];
      });
      
      // Create the heat layer
      // @ts-ignore - TypeScript doesn't recognize the L.heatLayer function
      const layer = (L as any).heatLayer(heatPoints, {
        radius,
        blur,
        max,
        gradient
      });
      
      // Add to map
      layer.addTo(map);
      setHeatLayer(layer);
    }
    
    // Cleanup on unmount
    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points, radius, blur, max, gradient]);
  
  return null; // This component doesn't render anything visible
};

export default HeatmapLayer;
