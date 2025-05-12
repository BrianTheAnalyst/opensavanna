
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset, DatasetFilters } from "@/types/dataset";
import { isUserAdmin } from "@/services/userRoleService";

// Get all datasets with optional filtering
export const getDatasets = async (filters?: DatasetFilters): Promise<Dataset[]> => {
  try {
    let query = supabase.from('datasets').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.format) {
        query = query.eq('format', filters.format);
      }
      
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      
      if (filters.verificationStatus) {
        query = query.eq('verification_status', filters.verificationStatus);
      }
    }
    
    // Check if user is admin
    const isAdmin = await isUserAdmin();
    
    // If not admin, only show approved datasets
    if (!isAdmin && !filters?.verificationStatus) {
      query = query.eq('verification_status', 'approved');
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Failed to load datasets');
      return [];
    }
    
    // Return datasets with mapped properties using simple object creation
    return data.map(item => {
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
        file: item.file,
      };
      
      // Add verification fields conditionally to avoid TypeScript errors
      if ('verification_status' in item) {
        dataset.verificationStatus = item.verification_status as 'pending' | 'approved' | 'rejected' | undefined;
      }
      
      if ('verification_notes' in item) {
        dataset.verificationNotes = item.verification_notes as string;
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
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
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
    const isAdmin = await isUserAdmin();
    
    // Create dataset object using direct property assignment
    const dataset: Dataset = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      format: data.format,
      country: data.country,
      date: data.date,
      downloads: data.downloads || 0,
      featured: data.featured || false,
      file: data.file,
    };
    
    // Add verification fields conditionally
    if ('verification_status' in data) {
      dataset.verificationStatus = data.verification_status as 'pending' | 'approved' | 'rejected' | undefined;
    }
    
    if ('verification_notes' in data) {
      dataset.verificationNotes = data.verification_notes as string;
    }
    
    // Check permissions
    if (!isAdmin && dataset.verificationStatus !== 'approved') {
      // Check if the dataset belongs to the current user
      const { data: { user } } = await supabase.auth.getUser();
      const isOwner = user && data.user_id === user.id;
      
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
