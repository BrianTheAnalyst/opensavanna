
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
  featured: boolean;
  file?: string;
  license?: string;
  fileSize?: string;
  dataPoints?: number | string;
  timespan?: string;
  source?: string;
  tags?: string[];
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  dataFields?: Array<{
    name: string;
    description: string;
    type: string;
  }>;
  // Database column property names (for compatibility)
  verification_status?: 'pending' | 'approved' | 'rejected' | string;
  verification_notes?: string;
}

// Dataset filter options
export interface DatasetFilters {
  search?: string;
  category?: string;
  format?: string;
  country?: string;
  verificationStatus?: string;
}

// Simple DatasetWithEmail type
export interface DatasetWithEmail extends Dataset {
  userEmail?: string;
}
