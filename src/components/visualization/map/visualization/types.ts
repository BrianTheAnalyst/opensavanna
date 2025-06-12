
import { LatLngExpression } from 'leaflet';

export interface MapVisualizationProps {
  data?: any[];
  geoJSON?: any;
  title?: string;
  description?: string;
  isLoading?: boolean;
  category?: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'anomaly' | 'correlation';
  confidence: number;
  applied: boolean;
}

export interface TimeControlsProps {
  currentIndex: number;
  maxIndex?: number;
  setCurrentIndex: (index: number) => void;
  labels?: string[];
}

export interface GeoDataInfo {
  hasGeoData: boolean;
  mapCenter: LatLngExpression;
  mapZoom: number;
  processedGeoJSON: any;
}

export interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
  value?: number;
  timeIndex?: number;
  isAnomaly?: boolean;
  zScore?: number;
}

export interface TileLayerConfig {
  url: string;
  attribution?: string;
  attributionControl?: boolean;
}

export interface AnomalyControlsProps {
  anomalyDetection: boolean;
  onAnomalyToggle: (enabled: boolean) => void;
  anomalyThreshold: number;
  onThresholdChange: (value: number) => void;
}

export interface ColorScaleInfo {
  colorScale: string[];
  minValue: number;
  maxValue: number;
}

export interface MapVisualizationLayoutProps {
  sidebarCollapsed: boolean;
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  handleVisualizationTypeChange: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
  geoJSON: any;
  points: MapPoint[];
  defaultCenter: LatLngExpression;
  defaultZoom: number;
  category: string;
  timeIndex: number;
  activeLayers: string[];
  setActiveLayers: (layers: string[]) => void;
  anomalyDetection: boolean;
  anomalyThreshold: number;
  toggleSidebar: () => void;
  sidebarProps: any;
}

export interface MapVisualizationContentProps {
  title: string;
  description: string;
  anomalyDetection: boolean;
  data: any[];
  layoutProps: MapVisualizationLayoutProps;
}
