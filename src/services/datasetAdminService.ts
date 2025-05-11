
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

// Check if the current user is an admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // We need to use the correct table name here, assuming 'profiles' is not in the schema
    // For this example, let's check the 'datasets' table for admin status
    // In a real app, you would have a proper user roles table
    const { data, error } = await supabase
      .rpc('check_if_user_is_admin', { user_id: user.id })
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data?.is_admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Update dataset details
export const updateDataset = async (
  id: string,
  updates: Partial<Omit<Dataset, 'id' | 'user_id' | 'created_at'>>
): Promise<Dataset | null> => {
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      toast.error('You do not have permission to update datasets');
      return null;
    }
    
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
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
    // Check if user is admin
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      toast.error('You do not have permission to delete datasets');
      return false;
    }
    
    // Delete associated files from storage
    try {
      const { data: files } = await supabase.storage
        .from('dataset_files')
        .list(id);
        
      if (files && files.length > 0) {
        const filePaths = files.map(file => `${id}/${file.name}`);
        await supabase.storage
          .from('dataset_files')
          .remove(filePaths);
      }
    } catch (storageError) {
      console.error('Error deleting dataset files from storage:', storageError);
      // Continue with dataset deletion even if file deletion fails
    }
    
    // Delete the dataset record
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
