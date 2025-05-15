
import { LatLngExpression } from 'leaflet';

export interface MapVisualizationProps {
  data: any;
  title?: string;
  description?: string;
  isLoading?: boolean;
  geoJSON?: any;
  category?: string;
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
