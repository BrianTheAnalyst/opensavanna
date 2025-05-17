
import { LatLngExpression } from 'leaflet';

export interface MapVisualizationProps {
  data?: any[];
  geoJSON?: any;
  category?: string;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export interface GeoDataInfo {
  hasGeoData: boolean;
  mapCenter: LatLngExpression;
  mapZoom: number;
  processedGeoJSON: any | null;
}

export interface ColorScaleInfo {
  colorScale: string[];
  minValue: number;
  maxValue: number;
}

// Type definitions for the component props interfaces
export interface MapEmptyStateProps {
  title?: string;
  description?: string;
}

export interface MapLoadingStateProps {
  title?: string;
  description?: string;
}

export interface LayerControlsProps {
  onTileLayerChange: (layer: any) => void;
}

export interface TimeControlsProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  labels: string[];
}

export interface MapControlsProps {
  currentType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  setType: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
  hasGeoJSON: boolean;
  hasPoints: boolean;
}

export interface MapLegendProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  geoJSON?: any;
  category?: string;
}

export interface AnomalyDetectionProps {
  anomalyDetection: boolean;
  anomalyThreshold: number;
}
