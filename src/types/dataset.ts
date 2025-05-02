
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
  dataPoints?: number | string;
  timespan?: string;
  source?: string;
  tags?: string[];
  dataFields?: Array<{
    name: string;
    description: string;
    type: string;
  }>;
  verified?: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  verifiedAt?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

// Dataset filter options
export interface DatasetFilters {
  search?: string;
  category?: string;
  format?: string;
  country?: string;
  verified?: boolean;
}

// Dataset with user email
export interface DatasetWithEmail extends Dataset {
  email?: string;
  users?: { email: string } | null;
}

// For better type safety when handling Supabase response
export interface SupabaseDatasetItem {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number | null;
  featured?: boolean;
  file?: string;
  source?: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  verified?: boolean;
  verifiedAt?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  users: { email: string } | null;
}
