
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatasetWithEmail } from "@/types/dataset";
import { transformDatasetResponse } from "@/utils/datasetVerificationUtils";

// Fetch datasets with verification status
export const fetchDatasetsByVerificationStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<DatasetWithEmail[]> => {
  try {
    // Query datasets with verification status
    const { data, error } = await supabase
      .from('datasets')
      .select('*, users:user_id(email)')
      .eq('verificationStatus', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the response data to the correct type
    return transformDatasetResponse(data || []);
  } catch (error) {
    console.error('Error loading datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Update dataset verification status
export const updateDatasetVerificationStatus = async (
  datasetIds: string[], 
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    // Define the update object with the correct type that Supabase expects
    const updates = {
      verificationStatus: status,
      verified: status === 'approved',
      verifiedAt: status === 'approved' ? new Date().toISOString() : null
    };

    const { error } = await supabase
      .from('datasets')
      .update(updates)
      .in('id', datasetIds);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error updating dataset status:`, error);
    return false;
  }
};

// Send notification emails for batch operations
export const sendBatchNotifications = async (
  datasets: DatasetWithEmail[], 
  status: 'approved' | 'rejected'
): Promise<void> => {
  try {
    // Send notification for each dataset
    const emailPromises = datasets.map(dataset => {
      if (!dataset.email) {
        console.warn(`No email available for dataset ${dataset.id}`);
        return Promise.resolve();
      }
      
      return fetch('https://dwngyvatnoeyoaplwoba.supabase.co/functions/v1/send-dataset-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: dataset.email,
          datasetTitle: dataset.title,
          status: status,
          feedback: status === 'approved' 
            ? 'Your dataset has been approved in our batch review process.' 
            : 'Your dataset was rejected during our review process. Please review our dataset guidelines and consider resubmitting.'
        }),
      }).catch(error => {
        console.error(`Failed to send notification for dataset ${dataset.id}:`, error);
      });
    });
    
    await Promise.all(emailPromises);
    console.log(`Batch notifications sent for ${status} datasets`);
  } catch (error) {
    console.error('Error sending batch notifications:', error);
  }
};
