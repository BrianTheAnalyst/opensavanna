
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

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
