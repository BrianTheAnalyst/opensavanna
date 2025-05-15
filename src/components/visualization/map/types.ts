
import { LatLngExpression } from 'leaflet';

export interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
  value?: number;
  timeIndex?: number;
}

export interface MapContainerProps {
  // Renamed props to avoid conflict with react-leaflet's props
  defaultCenter: LatLngExpression;
  defaultZoom: number;
  geoJSON?: any;
  points?: MapPoint[];
  visualizationType?: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  category?: string;
  currentTimeIndex?: number;
  activeLayers?: string[];
}

export interface TileLayerConfig {
  url: string;
  attributionControl: boolean;
  attribution: string;
}
