
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
    
    // Build the query parameters separately instead of chaining
    const queryParams: any = {
      select: '*',
      order: [{ column: 'created_at', ascending: false }],
      filter: [],
    };
    
    // Add search filter if specified
    if (filters?.search) {
      queryParams.filter.push({
        operator: 'or',
        conditions: [
          { column: 'title', operator: 'ilike', value: `%${filters.search}%` },
          { column: 'description', operator: 'ilike', value: `%${filters.search}%` }
        ]
      });
    }
    
    // Add category filter if specified
    if (filters?.category) {
      queryParams.filter.push({
        column: 'category',
        operator: 'eq',
        value: filters.category
      });
    }
    
    // Add format filter if specified
    if (filters?.format) {
      queryParams.filter.push({
        column: 'format',
        operator: 'eq',
        value: filters.format
      });
    }
    
    // Add country filter if specified
    if (filters?.country) {
      queryParams.filter.push({
        column: 'country',
        operator: 'eq',
        value: filters.country
      });
    }
    
    // Add verification status filter or default to approved for non-admins
    if (filters?.verificationStatus) {
      queryParams.filter.push({
        column: 'verification_status',
        operator: 'eq',
        value: filters.verificationStatus
      });
    } else if (!isAdmin) {
      queryParams.filter.push({
        column: 'verification_status',
        operator: 'eq',
        value: 'approved'
      });
    }
    
    // Execute query using rpc to avoid deep type recursion
    // This is a workaround to avoid the TypeScript error
    let { data, error } = await supabase.rpc('get_filtered_datasets', { 
      params: JSON.stringify(queryParams) 
    }).then(resp => {
      // If RPC doesn't exist, fall back to manual query
      if (resp.error && resp.error.message.includes('does not exist')) {
        // Fallback implementation using direct querying
        return executeFilteredQuery(queryParams);
      }
      return resp;
    });
    
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

// Helper function to manually execute filtered query when RPC is not available
async function executeFilteredQuery(queryParams: any) {
  // Start with basic query
  let query = supabase.from('datasets').select('*');
  
  // Apply filters manually
  for (const filter of queryParams.filter) {
    if (filter.operator === 'or') {
      const orConditions = filter.conditions.map((c: any) => 
        `${c.column}.${c.operator}.${c.value}`
      ).join(',');
      query = query.or(orConditions);
    } else {
      query = query.filter(filter.column, filter.operator, filter.value);
    }
  }
  
  // Apply ordering
  if (queryParams.order && queryParams.order.length > 0) {
    const order = queryParams.order[0];
    query = query.order(order.column, { ascending: order.ascending });
  }
  
  return await query;
}

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
