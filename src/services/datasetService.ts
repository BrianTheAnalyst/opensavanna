
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset, DatasetFilters } from "@/types/dataset";
import { isUserAdmin } from "@/services/userRoleService";
import { getDatasetById as fetchDatasetById } from "./dataset/datasetFetchService";

// Interface for raw dataset records from database
export interface RawDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads?: number;
  featured?: boolean;
  file?: string;
  user_id?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  verification_notes?: string;
  [key: string]: any; // For any other properties
}

// Get all datasets with optional filtering - delegating to specialized service
export const getDatasets = async (filters?: DatasetFilters): Promise<Dataset[]> => {
  try {
    // Import here to avoid circular dependencies
    const { fetchDatasets } = await import('./dataset/datasetFetchService');
    return await fetchDatasets(filters);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Get a single dataset by ID - delegating to specialized service
export const getDatasetById = async (id: string): Promise<Dataset | null> => {
  return fetchDatasetById(id);
};

// Re-export functions from other service modules for backward compatibility
export { 
  getDatasetVisualization,
  transformSampleDataForCategory 
} from './datasetVisualizationService';

export { 
  getCategoryCounts 
} from './datasetAnalyticsService';

export {
  updateDataset,
  deleteDataset,
  isUserAdmin
} from './datasetAdminService';
