
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

// Get all datasets for admin
export const getAdminDatasets = async (): Promise<Dataset[]> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching admin datasets:', error);
      toast.error('Failed to load datasets');
      return [];
    }
    
    return data as Dataset[];
  } catch (error) {
    console.error('Error fetching admin datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Check if user has admin role
export const isUserAdmin = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return false;
  }
  
  try {
    // This is a placeholder implementation - in a real app, you would check
    // against a roles table or use a Supabase Function to verify admin status
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Update a dataset as admin
export const updateDataset = async (id: string, updates: Partial<Dataset>): Promise<Dataset | null> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating dataset as admin:', error);
      toast.error('Failed to update dataset');
      return null;
    }
    
    if (!data) {
      toast.error('Dataset not found');
      return null;
    }
    
    toast.success('Dataset updated successfully');
    return data as Dataset;
  } catch (error) {
    console.error('Error updating dataset as admin:', error);
    toast.error('Failed to update dataset');
    return null;
  }
};

// Delete a dataset as admin
export const deleteDataset = async (id: string): Promise<boolean> => {
  try {
    // First delete any files associated with this dataset
    const { error: storageError } = await supabase.storage
      .from('dataset_files')
      .remove([`${id}/*`]);
    
    if (storageError) {
      console.error('Error deleting dataset files:', storageError);
      // Continue anyway, as we still want to delete the dataset record
    }
    
    // Then delete the dataset
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

// For backward compatibility
export const updateDatasetAsAdmin = updateDataset;
export const deleteDatasetAsAdmin = deleteDataset;
