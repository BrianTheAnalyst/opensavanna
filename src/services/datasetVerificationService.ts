
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset, DatasetWithEmail } from "@/types/dataset";
import { isUserAdmin } from "./userRoleService";

// Fetch datasets with verification status
export const fetchDatasetsWithVerificationStatus = async (status?: string): Promise<DatasetWithEmail[]> => {
  try {
    let query = supabase
      .from('datasets')
      .select(`
        *,
        user_id
      `)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('verificationStatus', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Failed to load datasets');
      return [];
    }

    // For each dataset, try to get the user's email
    const datasetsWithEmail: DatasetWithEmail[] = [];
    
    for (const dataset of data) {
      let datasetWithEmail: DatasetWithEmail = { ...dataset };
      
      if (dataset.user_id) {
        // Get user email from auth.users - note that this requires admin privileges
        const { data: userData } = await supabase.auth.admin.getUserById(dataset.user_id);
        
        if (userData && userData.user) {
          datasetWithEmail.userEmail = userData.user.email;
        }
      }
      
      datasetsWithEmail.push(datasetWithEmail);
    }
    
    return datasetsWithEmail;
  } catch (error) {
    console.error('Error fetching datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Update dataset verification status
export const updateDatasetVerificationStatus = async (
  id: string, 
  status: 'pending' | 'approved' | 'rejected', 
  notes?: string
): Promise<Dataset | null> => {
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      toast.error('You do not have permission to perform this action');
      return null;
    }
    
    const updates = {
      verificationStatus: status,
      verificationNotes: notes || null
    };
    
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating dataset status:', error);
      toast.error('Failed to update dataset status');
      return null;
    }
    
    toast.success(`Dataset ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}`);
    return data as Dataset;
  } catch (error) {
    console.error('Error updating dataset status:', error);
    toast.error('Failed to update dataset status');
    return null;
  }
};

// Get verification statistics
export const getVerificationStats = async (): Promise<{ pending: number; approved: number; rejected: number }> => {
  try {
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    // Count pending datasets
    const { count: pendingCount, error: pendingError } = await supabase
      .from('datasets')
      .select('id', { count: 'exact', head: true })
      .eq('verificationStatus', 'pending');
    
    if (!pendingError) {
      stats.pending = pendingCount || 0;
    }
    
    // Count approved datasets
    const { count: approvedCount, error: approvedError } = await supabase
      .from('datasets')
      .select('id', { count: 'exact', head: true })
      .eq('verificationStatus', 'approved');
    
    if (!approvedError) {
      stats.approved = approvedCount || 0;
    }
    
    // Count rejected datasets
    const { count: rejectedCount, error: rejectedError } = await supabase
      .from('datasets')
      .select('id', { count: 'exact', head: true })
      .eq('verificationStatus', 'rejected');
    
    if (!rejectedError) {
      stats.rejected = rejectedCount || 0;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting verification stats:', error);
    return { pending: 0, approved: 0, rejected: 0 };
  }
};
