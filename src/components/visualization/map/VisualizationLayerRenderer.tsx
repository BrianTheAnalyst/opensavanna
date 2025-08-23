
import React from 'react';

import ClusterMarkers from './ClusterMarkers';
import GeoJSONLayer from './GeoJSONLayer';
import HeatmapLayer from './HeatmapLayer';
import PointMarkers from './PointMarkers';
import { MapPoint } from './types';
import { detectAnomalies } from './utils/anomalyDetection';

interface VisualizationLayerRendererProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  geoJSON?: any;
  points: MapPoint[];
  category?: string;
  currentTimeIndex: number;
  isActive: boolean;
  anomalyDetection?: boolean;
  anomalyThreshold?: number;
}

const VisualizationLayerRenderer: React.FC<VisualizationLayerRendererProps> = ({
  visualizationType,
  geoJSON,
  points,
  category,
  currentTimeIndex,
  isActive,
  anomalyDetection = false,
  anomalyThreshold = 2.0
}) => {
  if (!isActive) return null;

  // Process anomaly detection if enabled
  const processedPoints = React.useMemo(() => {
    if (anomalyDetection && points.length > 0) {
      return detectAnomalies(points, anomalyThreshold);
    }
    return points;
  }, [points, anomalyDetection, anomalyThreshold]);

  switch (visualizationType) {
    case 'choropleth':
      // Show GeoJSON layer for choropleth
      return geoJSON ? (
        <GeoJSONLayer 
          geoJSON={geoJSON} 
          visualizationType="choropleth" 
          category={category}
          timeIndex={currentTimeIndex}
          anomalyDetection={anomalyDetection}
          anomalyThreshold={anomalyThreshold}
        />
      ) : null;
    
    case 'heatmap':
      // Show heatmap layer if we have points
      return processedPoints.length > 0 ? <HeatmapLayer points={processedPoints} /> : null;
    
    case 'cluster':
      // Show cluster markers if we have points
      return processedPoints.length > 0 ? <ClusterMarkers points={processedPoints} /> : null;
    
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
            anomalyDetection={anomalyDetection}
            anomalyThreshold={anomalyThreshold}
          />
        );
      } else if (processedPoints.length > 0) {
        return <PointMarkers points={processedPoints} highlightAnomalies={anomalyDetection} />;
      }
      return null;
  }
};

export default VisualizationLayerRenderer;
