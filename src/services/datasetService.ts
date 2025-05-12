
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset, DatasetFilters } from "@/types/dataset";
import { isUserAdmin } from "@/services/userRoleService";

// Interface for raw dataset records from database
interface RawDataset {
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

// Get all datasets with optional filtering
export const getDatasets = async (filters?: DatasetFilters): Promise<Dataset[]> => {
  try {
    // Check user role outside of the query chain to simplify types
    let isAdmin = false;
    try {
      isAdmin = await isUserAdmin();
    } catch (err) {
      console.error('Error checking admin status:', err);
      // Default to non-admin if there's an error
    }
    
    // Start with basic query
    let query = supabase.from('datasets').select('*');
    
    // Apply search filter if specified
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    
    // Apply category filter if specified
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    // Apply format filter if specified
    if (filters?.format) {
      query = query.eq('format', filters.format);
    }
    
    // Apply country filter if specified
    if (filters?.country) {
      query = query.eq('country', filters.country);
    }
    
    // Apply verification status filter or default to approved for non-admins
    if (filters?.verificationStatus) {
      query = query.eq('verification_status', filters.verificationStatus);
    } else if (!isAdmin) {
      query = query.eq('verification_status', 'approved');
    }
    
    // Apply ordering
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Failed to load datasets');
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    // Map database records to Dataset type with explicit mapping
    return (data as RawDataset[]).map((item: RawDataset) => {
      // Create a dataset with known fields
      const dataset: Dataset = {
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        format: item.format,
        country: item.country,
        date: item.date,
        downloads: item.downloads || 0,
        featured: item.featured || false,
        file: item.file
      };
      
      // Add optional fields if they exist
      if (item.verification_status) {
        dataset.verificationStatus = item.verification_status;
      }
      
      if (item.verification_notes) {
        dataset.verificationNotes = item.verification_notes;
      }
      
      return dataset;
    });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Get a single dataset by ID
export const getDatasetById = async (id: string): Promise<Dataset | null> => {
  try {
    // Using a simpler approach to avoid complex type inference
    const queryResponse = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    const { data, error } = queryResponse;
    
    if (error) {
      console.error('Error fetching dataset:', error);
      toast.error('Failed to load dataset');
      return null;
    }
    
    if (!data) {
      toast.error('Dataset not found');
      return null;
    }
    
    // Check if dataset is approved or user is admin
    let isAdmin = false;
    try {
      isAdmin = await isUserAdmin();
    } catch (err) {
      console.error('Error checking admin status:', err);
      // Default to non-admin if there's an error
    }
    
    // Cast to our RawDataset interface
    const rawDataset = data as RawDataset;
    
    // Create dataset object with known fields
    const dataset: Dataset = {
      id: rawDataset.id,
      title: rawDataset.title,
      description: rawDataset.description,
      category: rawDataset.category,
      format: rawDataset.format,
      country: rawDataset.country,
      date: rawDataset.date,
      downloads: rawDataset.downloads || 0,
      featured: rawDataset.featured || false,
      file: rawDataset.file
    };
    
    // Add optional fields
    if (rawDataset.verification_status) {
      dataset.verificationStatus = rawDataset.verification_status;
    }
    
    if (rawDataset.verification_notes) {
      dataset.verificationNotes = rawDataset.verification_notes;
    }
    
    // Check permissions
    if (!isAdmin && dataset.verificationStatus !== 'approved') {
      // Check if the dataset belongs to the current user
      const { data: { user } } = await supabase.auth.getUser();
      const isOwner = user && rawDataset.user_id === user.id;
      
      if (!isOwner) {
        toast.error('You do not have permission to view this dataset');
        return null;
      }
    }
    
    return dataset;
  } catch (error) {
    console.error('Error fetching dataset:', error);
    toast.error('Failed to load dataset');
    return null;
  }
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
