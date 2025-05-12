
import React, { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

// Enable TypeScript to recognize the heat plugin
declare module "leaflet" {
  namespace HeatLayer {
    interface HeatLayerOptions {
      minOpacity?: number;
      maxZoom?: number;
      radius?: number;
      blur?: number;
      max?: number;
      gradient?: {[key: number]: string};
    }
  }
  
  namespace Layer {
    interface LayerOptions {
      minOpacity?: number;
      maxZoom?: number;
      radius?: number;
      blur?: number;
      max?: number;
      gradient?: {[key: number]: string};
    }
  }
  
  function heatLayer(
    latlngs: Array<[number, number]> | Array<[number, number, number]>,
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
    if (!points || points.length === 0 || !L.heatLayer) return;
    
    // Convert points to format expected by heatLayer
    const heatPoints = points.map(point => {
      const intensity = point.value !== undefined ? point.value : 1;
      return [point.lat, point.lng, Math.min(Math.max(intensity, 0.1), 1)] as [number, number, number];
    });
    
    // Create and add heat layer
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
