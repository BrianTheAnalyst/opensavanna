
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
    id?: string;
    datasetId: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' | 'scatter';
    category: string;
    data: any[];
    geoJSON?: any;
    timeAxis?: string;
    valueLabel?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    description?: string;
    purpose?: string;
    intelligentInsights?: Array<{
      type: string;
      title: string;
      description: string;
      confidence: number;
      impact: string;
      recommendations?: string[];
    }>;
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
