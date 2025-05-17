
import { LatLngExpression } from 'leaflet';

export interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
  value?: number;
  timeIndex?: number;
  isAnomaly?: boolean;
  zScore?: number;
  // Extended properties
  cluster?: number;
  isSpatialOutlier?: boolean;
  outlierScore?: number;
  properties?: Record<string, any>;
}

export interface MapContainerProps {
  defaultCenter: LatLngExpression;
  defaultZoom: number;
  geoJSON?: any;
  points?: MapPoint[];
  visualizationType?: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  category?: string;
  currentTimeIndex?: number;
  activeLayers?: string[];
  anomalyDetection?: boolean;
  anomalyThreshold?: number;
}

export interface TileLayerConfig {
  url: string;
  attributionControl: boolean;
  attribution: string;
}

export interface AnomalyControlsProps {
  anomalyDetection: boolean;
  onAnomalyToggle: (enabled: boolean) => void;
  anomalyThreshold: number;
  onThresholdChange: (value: number) => void;
}
