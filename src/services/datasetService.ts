import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset, DatasetFilters } from "@/types/dataset";

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
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Failed to load datasets');
      return [];
    }
    
    return data as Dataset[];
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
    
    return data as Dataset;
  } catch (error) {
    console.error('Error fetching dataset:', error);
    toast.error('Failed to load dataset');
    return null;
  }
};

// Get dataset visualization data
export const getDatasetVisualization = async (id: string): Promise<any> => {
  try {
    // First, get the dataset to check the category and format
    const dataset = await getDatasetById(id);
    if (!dataset) return [];
    
    // If there's a file URL, try to fetch and parse the data
    if (dataset.file) {
      try {
        const response = await fetch(dataset.file);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        
        // Handle different file formats
        if (dataset.format.toLowerCase() === 'csv') {
          const text = await response.text();
          return parseCSVData(text, dataset.category);
        } else if (dataset.format.toLowerCase() === 'json') {
          const json = await response.json();
          return formatJSONForVisualization(json, dataset.category);
        } else {
          // For other formats, fall back to sample data
          console.log('Unsupported format, using sample data');
          const { sampleVisData } = await import('@/data/visualizationData');
          return transformSampleDataForCategory(sampleVisData, dataset.category);
        }
      } catch (error) {
        console.error('Error processing dataset file:', error);
        // Fall back to sample data on error
        const { sampleVisData } = await import('@/data/visualizationData');
        return transformSampleDataForCategory(sampleVisData, dataset.category);
      }
    } else {
      // No file available, use sample data
      const { sampleVisData } = await import('@/data/visualizationData');
      return transformSampleDataForCategory(sampleVisData, dataset.category);
    }
  } catch (error) {
    console.error('Error fetching visualization data:', error);
    // Return empty dataset on error
    return [];
  }
};

// Helper function to parse CSV data
const parseCSVData = (csvText: string, category: string): any[] => {
  // Basic CSV parsing - for production use a robust CSV parser library
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Convert CSV to array of objects
  const parsedData = lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      // Try to convert numerical values
      const value = values[index];
      obj[header] = !isNaN(Number(value)) ? Number(value) : value;
    });
    return obj;
  });
  
  // Format data for visualization
  return formatDataForVisualization(parsedData, category);
};

// Format JSON data for visualization
const formatJSONForVisualization = (jsonData: any, category: string): any[] => {
  // Handle both array and object formats
  const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  return formatDataForVisualization(dataArray, category);
};

// Common function to format data for visualization
const formatDataForVisualization = (data: any[], category: string): any[] => {
  // Extract key fields based on category
  if (data.length === 0) return [];
  
  // For each category, determine key fields for name and value
  let nameField = 'name';
  let valueField = 'value';
  
  switch (category.toLowerCase()) {
    case 'economics':
      nameField = data[0].category || data[0].sector || data[0].region || Object.keys(data[0])[0];
      valueField = data[0].amount || data[0].value || data[0].gdp || Object.keys(data[0])[1];
      break;
    case 'health':
      nameField = data[0].condition || data[0].disease || data[0].region || Object.keys(data[0])[0];
      valueField = data[0].cases || data[0].patients || data[0].value || Object.keys(data[0])[1];
      break;
    case 'education':
      nameField = data[0].subject || data[0].level || data[0].region || Object.keys(data[0])[0];
      valueField = data[0].students || data[0].score || data[0].value || Object.keys(data[0])[1];
      break;
    default:
      // Try to determine fields automatically
      nameField = Object.keys(data[0]).find(key => 
        typeof data[0][key] === 'string' && !key.includes('id')) || Object.keys(data[0])[0];
      valueField = Object.keys(data[0]).find(key => 
        typeof data[0][key] === 'number') || Object.keys(data[0])[1];
  }
  
  // Format the data for visualization
  return data.map(item => ({
    name: String(item[nameField] || 'Unknown'),
    value: Number(item[valueField] || 0),
    // Include original data for reference
    rawData: { ...item }
  }));
};

// Transform sample data to match the dataset category
const transformSampleDataForCategory = (sampleData: any[], category: string): any[] => {
  // Clone the sample data
  const transformed = [...sampleData];
  
  // Customize names based on category
  switch (category.toLowerCase()) {
    case 'economics':
      return transformed.map((item, index) => ({
        ...item,
        name: ['GDP', 'Exports', 'Imports', 'Investment', 'Consumption'][index % 5]
      }));
    case 'health':
      return transformed.map((item, index) => ({
        ...item,
        name: ['Hospitals', 'Clinics', 'Patients', 'Doctors', 'Nurses'][index % 5]
      }));
    case 'education':
      return transformed.map((item, index) => ({
        ...item,
        name: ['Primary', 'Secondary', 'University', 'Vocational', 'Research'][index % 5]
      }));
    case 'environment':
      return transformed.map((item, index) => ({
        ...item,
        name: ['Forests', 'Lakes', 'Parks', 'Emissions', 'Protected Areas'][index % 5]
      }));
    case 'transport':
      return transformed.map((item, index) => ({
        ...item,
        name: ['Roads', 'Railways', 'Airports', 'Seaports', 'Public Transit'][index % 5]
      }));
    default:
      return transformed;
  }
};

// Get category counts for analytics
export const getCategoryCounts = async (): Promise<{ name: string, value: number }[]> => {
  try {
    // Get all categories first
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('datasets')
      .select('category');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return [];
    }
    
    if (!categoriesData || categoriesData.length === 0) {
      return [];
    }
    
    // Count occurrences of each category
    const categoryMap: Record<string, number> = {};
    
    categoriesData.forEach(item => {
      const category = item.category;
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    // Convert to array format for visualization
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error('Error getting category counts:', error);
    return [];
  }
};

// ADMIN FUNCTIONS

// Update a dataset
export const updateDataset = async (id: string, updates: Partial<Dataset>): Promise<Dataset | null> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating dataset:', error);
      toast.error('Failed to update dataset');
      return null;
    }
    
    toast.success('Dataset updated successfully');
    return data as Dataset;
  } catch (error) {
    console.error('Error updating dataset:', error);
    toast.error('Failed to update dataset');
    return null;
  }
};

// Delete a dataset
export const deleteDataset = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting dataset:', error);
      toast.error('Failed to delete dataset');
      return false;
    }
    
    toast.success('Dataset deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting dataset:', error);
    toast.error('Failed to delete dataset');
    return false;
  }
};

// Check if user is an admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // For now, we'll use email domain to determine admin status
    // In a production app, you'd use proper role-based access control
    const email = user.email;
    if (email && (email.endsWith('@admin.com') || email.endsWith('@dataplatform.org'))) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
