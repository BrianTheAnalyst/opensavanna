
import React from 'react';
import GeoJSONLayer from './GeoJSONLayer';
import PointMarkers from './PointMarkers';
import HeatmapLayer from './HeatmapLayer';
import ClusterMarkers from './ClusterMarkers';
import { MapPoint } from './types';

interface VisualizationLayerRendererProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  geoJSON?: any;
  points: MapPoint[];
  category?: string;
  currentTimeIndex: number;
  isActive: boolean;
}

const VisualizationLayerRenderer: React.FC<VisualizationLayerRendererProps> = ({
  visualizationType,
  geoJSON,
  points,
  category,
  currentTimeIndex,
  isActive
}) => {
  if (!isActive) return null;

  switch (visualizationType) {
    case 'choropleth':
      // Show GeoJSON layer for choropleth
      return geoJSON ? (
        <GeoJSONLayer 
          geoJSON={geoJSON} 
          visualizationType="choropleth" 
          category={category}
          timeIndex={currentTimeIndex}
        />
      ) : null;
    
    case 'heatmap':
      // Show heatmap layer if we have points
      return points.length > 0 ? <HeatmapLayer points={points} /> : null;
    
    case 'cluster':
      // Show cluster markers if we have points
      return points.length > 0 ? <ClusterMarkers points={points} /> : null;
    
    case 'standard':
    default:
      // Standard view - show GeoJSON if available, otherwise show point markers
      if (geoJSON) {
        return (
          <GeoJSONLayer 
            geoJSON={geoJSON} 
            visualizationType="standard" 
            category={category}
            timeIndex={currentTimeIndex}
          />
        );
      } else if (points.length > 0) {
        return <PointMarkers points={points} />;
      }
      return null;
  }
};

export default VisualizationLayerRenderer;
