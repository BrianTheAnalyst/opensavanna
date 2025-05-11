
import { Json } from '@/integrations/supabase/types';

// Common type for AI analysis structure used across dataset types
export interface AIAnalysis {
  summary?: string;
  insights?: string[];
  correlations?: Array<{
    field1: string;
    field2: string;
    strength: number;
    description: string;
  }>;
  anomalies?: Array<{
    field: string;
    description: string;
    impact: string;
  }>;
}

// Dataset base interface
export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number;
  featured?: boolean;
  file?: string | null;
  license?: string | null;
  fileSize?: string | null;
  dataPoints?: number | string | null;
  timespan?: string | null;
  source?: string | null;
  tags?: string[];
  dataFields?: Array<{
    name: string;
    description: string;
    type: string;
  }>;
  verified?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
  aiAnalysis?: AIAnalysis;
}

// Dataset filter options
export interface DatasetFilters {
  search?: string;
  category?: string;
  format?: string;
  country?: string;
  verified?: boolean;
}

// Dataset with user email - simplified version
export interface DatasetWithEmail extends Dataset {
  email: string | null;
}
