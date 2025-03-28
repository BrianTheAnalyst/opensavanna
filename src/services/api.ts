
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Types for our dataset
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
  // Add missing properties referenced in DatasetDetail.tsx
  license?: string;
  fileSize?: string;
  dataPoints?: string;
  timespan?: string;
  source?: string;
  tags?: string[];
  dataFields?: Array<{
    name: string;
    description: string;
    type: string;
  }>;
}

// Sample visualization data
export const sampleVisData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 700 },
];

// Get all datasets with optional filtering
export const getDatasets = async (
  filters?: { 
    search?: string; 
    category?: string; 
    format?: string;
    country?: string;
  }
): Promise<Dataset[]> => {
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

// Add a new dataset
export const addDataset = async (
  dataset: Omit<Dataset, 'id' | 'date' | 'downloads'>,
  file?: File
): Promise<Dataset | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to upload datasets');
      return null;
    }
    
    // Format the date
    const currentDate = new Date();
    const formattedDate = `Updated ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    
    // Create the dataset entry
    const newDataset = {
      ...dataset,
      date: formattedDate,
      downloads: 0,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('datasets')
      .insert(newDataset)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding dataset:', error);
      toast.error('Failed to add dataset');
      return null;
    }
    
    // If a file was provided, upload it to storage
    if (file && data.id) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${data.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dataset_files')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Dataset added but file upload failed');
        return data as Dataset;
      }
      
      // Get the public URL for the file
      const { data: publicURL } = supabase.storage
        .from('dataset_files')
        .getPublicUrl(filePath);
      
      // Update the dataset with the file URL
      const { error: updateError } = await supabase
        .from('datasets')
        .update({ file: publicURL.publicUrl })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error updating dataset with file URL:', updateError);
      } else {
        // Update the return data with the file URL
        data.file = publicURL.publicUrl;
      }
    }
    
    toast.success('Dataset added successfully');
    return data as Dataset;
  } catch (error) {
    console.error('Error adding dataset:', error);
    toast.error('Failed to add dataset');
    return null;
  }
};

// Get dataset visualization data
export const getDatasetVisualization = async (id: string): Promise<any> => {
  // For now, we'll return mock visualization data
  // In a real application, this could fetch actual visualization data from Supabase
  return sampleVisData;
};

// Download a dataset (updates download count and returns download URL)
export const downloadDataset = async (id: string): Promise<void> => {
  try {
    // First get the dataset to check if it has a file
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching dataset for download:', fetchError);
      toast.error('Failed to download dataset');
      return;
    }
    
    // Update download count
    const { error: updateError } = await supabase
      .from('datasets')
      .update({ downloads: (dataset.downloads || 0) + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating download count:', updateError);
    }
    
    // If the dataset has a file URL, open it
    if (dataset.file) {
      window.open(dataset.file, '_blank');
      toast.success('Dataset download started');
    } else {
      // For datasets without files, we could provide a fallback
      toast.info('This dataset does not have a downloadable file');
    }
  } catch (error) {
    console.error('Error downloading dataset:', error);
    toast.error('Failed to download dataset');
  }
};
