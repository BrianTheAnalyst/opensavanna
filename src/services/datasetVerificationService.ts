
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatasetWithEmail, Dataset } from "@/types/dataset";

// Fetch all datasets with their verification status and user email
export const fetchDatasetsWithVerificationStatus = async (): Promise<DatasetWithEmail[]> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Failed to load datasets for verification');
      return [];
    }
    
    // For each dataset, try to get the user's email
    const datasetsWithEmail = await Promise.all(
      (data as Dataset[]).map(async (dataset) => {
        // Handle user_id if it's not in the Dataset type
        const userId = (dataset as any).user_id;
        if (!userId) {
          return { ...dataset, userEmail: 'Unknown' };
        }
        
        // Get user email
        // Since we don't have a profiles table, we'll return unknown
        // In a real app, you would query a users or profiles table
        return { ...dataset, userEmail: 'Unknown' };
      })
    );
    
    return datasetsWithEmail;
  } catch (error) {
    console.error('Error fetching datasets with verification status:', error);
    toast.error('Failed to load datasets for verification');
    return [];
  }
};

// Update the verification status of a dataset
export const updateDatasetVerificationStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<boolean> => {
  try {
    // Create an updates object that is compatible with the dataset structure
    const updates: Record<string, any> = {
      verificationStatus: status
    };
    
    if (notes) {
      updates.verificationNotes = notes;
    }
    
    const { error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating dataset verification status:', error);
      toast.error('Failed to update verification status');
      return false;
    }
    
    toast.success(`Dataset ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating dataset verification status:', error);
    toast.error('Failed to update verification status');
    return false;
  }
};

// Get count of datasets pending verification
export const fetchPendingDatasetCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('datasets')
      .select('*', { count: 'exact', head: true })
      .is('verificationStatus', null)
      .or('verificationStatus.eq.pending');
    
    if (error) {
      console.error('Error counting pending datasets:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error counting pending datasets:', error);
    return 0;
  }
};

