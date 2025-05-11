
import { supabase } from '@/integrations/supabase/client';
import { DatasetWithEmail, VerificationStatus } from '@/types/dataset';
import { transformDatasetResponse } from '@/utils/datasetVerificationUtils';
import { toast } from 'sonner';

// Fetch datasets based on verification status
export const fetchDatasetsByVerificationStatus = async (status: VerificationStatus): Promise<DatasetWithEmail[]> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('*, users(email)')
      .eq('verificationStatus', status);
    
    if (error) {
      console.error('Error fetching datasets:', error);
      throw error;
    }
    
    // Use simple array type to avoid deep type analysis
    return transformDatasetResponse(data || []);
  } catch (error) {
    console.error('Failed to fetch datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Update dataset verification status - single dataset
export const updateDatasetVerificationStatus = async (
  datasetIds: string | string[],
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  const ids = Array.isArray(datasetIds) ? datasetIds : [datasetIds];
  
  try {
    // Create update object directly without custom interface
    const updateData = {
      verificationStatus: status,
      verifiedAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('datasets')
      .update(updateData)
      .in('id', ids);
    
    if (error) {
      console.error('Error updating dataset status:', error);
      toast.error('Failed to update dataset status');
      return false;
    }
    
    toast.success(`Dataset${ids.length > 1 ? 's' : ''} ${status} successfully`);
    return true;
  } catch (error) {
    console.error('Failed to update dataset status:', error);
    toast.error('Failed to update dataset status');
    return false;
  }
};

// Send notification emails for batch processing
export const sendBatchNotifications = async (
  datasets: DatasetWithEmail[],
  status: 'approved' | 'rejected'
): Promise<void> => {
  if (datasets.length === 0) return;
  
  try {
    // Group datasets by email to send one notification per user
    const emailGroups: Record<string, DatasetWithEmail[]> = {};
    
    datasets.forEach(dataset => {
      if (dataset.email) {
        if (!emailGroups[dataset.email]) {
          emailGroups[dataset.email] = [];
        }
        emailGroups[dataset.email].push(dataset);
      }
    });
    
    // Send notification for each email group
    const promises = Object.entries(emailGroups).map(async ([email, userDatasets]) => {
      const titles = userDatasets.map(d => d.title).join(', ');
      
      const { error } = await supabase.functions.invoke('send-dataset-notification', {
        body: {
          email,
          datasetTitles: titles,
          status,
          count: userDatasets.length
        }
      });
      
      if (error) {
        console.error(`Failed to send notification to ${email}:`, error);
      }
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to send batch notifications:', error);
  }
};
