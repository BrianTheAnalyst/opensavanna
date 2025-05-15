
import { Dataset } from '@/types/dataset';

export interface UseDatasetVisualizationProps {
  id?: string;
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

export interface UseDatasetVisualizationResult {
  dataset: Dataset | null;
  visualizationData: any[];
  isLoading: boolean;
  error: string | null;
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  handleRetry: () => Promise<void>;
  geoJSON: any | null;
}
