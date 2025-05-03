
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";
import { isUserAdmin as checkUserAdmin } from "./userRoleService";

// Check if user is an admin
export const isUserAdmin = async (): Promise<boolean> => {
  return checkUserAdmin();
};

// Update a dataset
export const updateDataset = async (id: string, updates: Partial<Dataset>): Promise<Dataset | null> => {
  try {
    // Convert AIAnalysis to JSON format Supabase expects
    const supabaseUpdates = { ...updates };
    
    const { data, error } = await supabase
      .from('datasets')
      .update(supabaseUpdates)
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
