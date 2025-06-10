
import { Dataset } from "@/types/dataset";

export interface DataInsightResult {
  question: string;
  answer: string;
  datasets: Dataset[];
  visualizations: {
    datasetId: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
    category: string;
    data: any[];
    geoJSON?: any;
    timeAxis?: string;
    valueLabel?: string;
  }[];
  insights: string[];
  comparisonResult?: {
    title: string;
    description: string;
    data: any[];
  };
  followUpQuestions?: string[]; // New field for follow-up questions
}
