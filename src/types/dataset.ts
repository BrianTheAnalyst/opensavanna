
// Dataset related types
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
  file?: string;
  license?: string;
  fileSize?: string;
  dataPoints?: number | string; // Adding dataPoints as either number or string
  timespan?: string;
  source?: string;
  tags?: string[];
  dataFields?: Array<{
    name: string;
    description: string;
    type: string;
  }>;
}

// Dataset filter options
export interface DatasetFilters {
  search?: string;
  category?: string;
  format?: string;
  country?: string;
}
