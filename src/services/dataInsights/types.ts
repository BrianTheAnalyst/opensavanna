
export interface DataInsightResult {
  datasetId: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
  category: string;
  data: any[];
  geoJSON?: any;
  timeAxis?: string;
  valueLabel?: string;
  visualizations: Array<{
    datasetId: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
    category: string;
    data: any[];
    geoJSON?: any;
    timeAxis?: string;
    valueLabel?: string;
  }>;
  insights: string[];
  summary: string;
  recommendations: string[];
}

export interface GenerateInsightsOptions {
  includeRecommendations?: boolean;
  maxInsights?: number;
  focusAreas?: string[];
}

export interface InsightGenerationContext {
  category: string;
  dataSize: number;
  hasTimeData: boolean;
  hasGeographicData: boolean;
  numericFields: string[];
  categoricalFields: string[];
}
