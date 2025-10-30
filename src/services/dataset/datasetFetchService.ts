
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset, DatasetFilters } from "@/types/dataset";
import { isUserAdmin } from "@/services/userRoleService";
import { RawDataset } from "@/services/datasetService";

// Helper function to map raw database records to Dataset type
const mapRawDatasetToDataset = (item: RawDataset): Dataset => {
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
};

// Get all datasets with optional filtering
export const fetchDatasets = async (filters?: DatasetFilters): Promise<Dataset[]> => {
  try {
    // Check user role outside of the query chain to simplify types
    let isAdmin = false;
    try {
      isAdmin = await isUserAdmin();
    } catch (err) {
      console.error('Error checking admin status:', err);
      // Default to non-admin if there's an error
    }
    
    // Construct the query manually rather than through method chaining
    // to avoid TypeScript recursion issues
    const query = {
      table: 'datasets',
      select: '*',
      filters: [] as {column: string, operator: string, value: any}[]
    };
    
    // Build filters array
    if (filters?.search) {
      // Handle search as a special case since it's an OR condition
      // We'll apply this separately
    }
    
    if (filters?.category) {
      query.filters.push({
        column: 'category',
        operator: 'eq',
        value: filters.category
      });
    }
    
    if (filters?.format) {
      query.filters.push({
        column: 'format',
        operator: 'eq',
        value: filters.format
      });
    }
    
    if (filters?.country) {
      query.filters.push({
        column: 'country',
        operator: 'eq',
        value: filters.country
      });
    }
    
    if (filters?.verificationStatus) {
      query.filters.push({
        column: 'verification_status',
        operator: 'eq',
        value: filters.verificationStatus
      });
    } else if (!isAdmin) {
      query.filters.push({
        column: 'verification_status',
        operator: 'eq',
        value: 'approved'
      });
    }
    
    // Now execute query with manual filtering to avoid deep type recursion
    // Exclude user_id from public queries to prevent user tracking
    let builder = supabase.from('datasets').select('id, title, description, category, format, country, date, downloads, featured, file, verification_status, verification_notes, created_at, updated_at, aiAnalysis, verification_feedback_sent');
    
    // Apply all simple filters
    query.filters.forEach(filter => {
      // Use any to bypass TypeScript deep recursion
      (builder as any) = (builder as any).filter(filter.column, filter.operator, filter.value);
    });
    
    // Apply search filter separately (OR condition)
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      // Use explicit cast to avoid deep type recursion
      builder = (builder as any).or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    
    // Add ordering
    builder = (builder as any).order('created_at', { ascending: false });
    
    // Execute the query
    const { data, error } = await builder;
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Unable to load datasets. Please try again.');
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    // Map database records to Dataset type with explicit mapping
    return (data as RawDataset[]).map(mapRawDatasetToDataset);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    toast.error('Unable to load datasets. Please try again.');
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
      toast.error('Unable to load dataset. Please try again.');
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
    
    // Create dataset using our helper function
    const dataset = mapRawDatasetToDataset(rawDataset);
    
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
    toast.error('Unable to load dataset. Please try again.');
    return null;
  }
};
