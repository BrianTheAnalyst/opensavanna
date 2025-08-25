
import { Dataset } from "@/types/dataset";
import { ValidationResult } from "./dataValidation";

export interface DataInsightResult {
  question: string;
  answer: string;
  datasets: Dataset[];
  visualizations: {
    datasetId: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
    category: string;
    data: any[] | null;
    geoJSON?: any;
    timeAxis?: string;
    valueLabel?: string;
    hasData?: boolean;
    error?: string;
    // Enhanced validation and confidence data
    validation?: ValidationResult;
    confidence?: number;
    dataSource?: 'real' | 'sample' | 'empty';
    aiRelevanceScore?: number; // AI-calculated relevance score
  }[];
  insights: string[];
  comparisonResult?: {
    title: string;
    description: string;
    data: any[];
  };
  followUpQuestions?: string[];
  // NEW: AI Analysis metadata
  aiAnalysis?: {
    confidence: number;
    interpretation: {
      intent: string;
      domain: string;
      keywords: string[];
      synonyms: string[];
    };
    recommendations: string[];
  };
}
