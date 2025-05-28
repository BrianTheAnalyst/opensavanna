
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
  question?: string;
  answer?: string;
  followUpQuestions?: string[];
  comparisonResult?: {
    title: string;
    description: string;
    data: any[];
  };
  datasets?: any[];
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
