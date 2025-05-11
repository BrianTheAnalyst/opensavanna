
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
        if (!dataset.user_id) {
          return { ...dataset, userEmail: 'Unknown' };
        }
        
        // Get user email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', dataset.user_id)
          .maybeSingle();
        
        if (userError || !userData) {
          return { ...dataset, userEmail: 'Unknown' };
        }
        
        return { ...dataset, userEmail: userData.email || 'Unknown' };
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
    const updateData: {
      verificationStatus: 'pending' | 'approved' | 'rejected';
      verificationNotes?: string;
    } = {
      verificationStatus: status
    };
    
    if (notes) {
      updateData.verificationNotes = notes;
    }
    
    const { error } = await supabase
      .from('datasets')
      .update(updateData)
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
