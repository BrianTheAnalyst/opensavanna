
export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  value: number;
  properties?: Record<string, any>;
  timeIndex?: number;
  cluster?: number;
  isAnomaly?: boolean;
  zScore?: number;
  density?: number;
}

export interface AdvancedMapConfig {
  colorScheme: 'viridis' | 'plasma' | 'inferno' | 'magma' | 'turbo' | 'spectral';
  clusterRadius: number;
  heatmapIntensity: number;
  anomalyDetection: boolean;
  temporalAnimation: boolean;
  showInsights: boolean;
  spatialSmoothing: boolean;
  dataLayers: string[];
}

export interface SpatialAnalysisResult {
  moransI: number;
  pValue: number;
  zScore: number;
  clustering: 'clustered' | 'dispersed' | 'random';
  hotspots: MapPoint[];
  coldspots: MapPoint[];
  outliers: MapPoint[];
  neighborhoods: Array<{
    center: MapPoint;
    neighbors: MapPoint[];
    avgValue: number;
  }>;
}

export interface DataPattern {
  clusters: Array<{
    id: string;
    center: [number, number];
    points: MapPoint[];
    avgValue: number;
    variance: number;
  }>;
  outliers: MapPoint[];
  hasTemporalData: boolean;
  timeRange?: { min: number; max: number };
  dominantRegion?: string;
  correlations: Array<{
    variable1: string;
    variable2: string;
    correlation: number;
    significance: number;
  }>;
}

export interface FlowData {
  origin: MapPoint;
  destination: MapPoint;
  value: number;
  properties?: Record<string, any>;
}

export interface ChoroplethData {
  feature: any;
  value: number;
  normalizedValue: number;
  rank: number;
  isOutlier: boolean;
}
