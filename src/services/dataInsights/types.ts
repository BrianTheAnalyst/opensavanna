
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
    // NEW: Validation and confidence data
    validation?: ValidationResult;
    confidence?: number;
    dataSource?: 'real' | 'sample' | 'empty';
  }[];
  insights: string[];
  comparisonResult?: {
    title: string;
    description: string;
    data: any[];
  };
  followUpQuestions?: string[]; // New field for follow-up questions
}
