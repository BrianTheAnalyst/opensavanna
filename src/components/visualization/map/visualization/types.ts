
import { LatLngExpression } from 'leaflet';

// Interface for props
export interface MapVisualizationProps {
  data: any;
  title?: string;
  description?: string;
  isLoading?: boolean;
  geoJSON?: any;
  category?: string;
}

// Interface for min/max values
export interface MinMaxValues {
  min: number;
  max: number;
}

export interface GeoDataInfo {
  hasGeoData: boolean;
  mapCenter: LatLngExpression;
  mapZoom: number;
  processedGeoJSON: any | null;
}
