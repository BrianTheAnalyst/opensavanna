
import { toast } from "sonner";
import { DatasetWithEmail } from '@/types/dataset';
import { 
  fetchDatasetsWithVerificationStatus,
  updateDatasetVerificationStatus,
  sendDatasetFeedback,
  publishDataset as publishDatasetService
} from '@/services/verification';
import { supabase } from "@/integrations/supabase/client";
import { normalizeDataset, validateDatasetStatus } from './datasetVerificationUtils';

/**
 * Load all datasets with their verification status
 */
export const loadAllDatasets = async (): Promise<{
  pending: DatasetWithEmail[],
  approved: DatasetWithEmail[],
  rejected: DatasetWithEmail[]
}> => {
  try {
    // Load all datasets with their verification status
    const allDatasets = await fetchDatasetsWithVerificationStatus();
    
    // Process and normalize all datasets first
    const normalizedDatasets = allDatasets.map(normalizeDataset);
    
    // Then filter the normalized datasets based on the database status
    const pending = normalizedDatasets.filter(d => 
      !d.verification_status || d.verification_status === 'pending'
    );
    
    const approved = normalizedDatasets.filter(d => 
      d.verification_status === 'approved'
    );
    
    const rejected = normalizedDatasets.filter(d => 
      d.verification_status === 'rejected'
    );
    
    return { pending, approved, rejected };
  } catch (error) {
    console.error('Error loading datasets:', error);
    toast.error('Failed to load datasets', {
      description: "Could not fetch datasets for verification"
    });
    return { pending: [], approved: [], rejected: [] };
  }
};

/**
 * Update the verification status of a dataset
 */
export const updateStatus = async (
  id: string, 
  status: 'pending' | 'approved' | 'rejected', 
  notes?: string
): Promise<boolean> => {
  try {
    // First update in the database
    const result = await updateDatasetVerificationStatus(id, status, notes);
    
    if (!result.success) {
      console.error('Failed to update dataset status in database:', result.error);
      toast.error(`Update failed`, {
        description: `Failed to update dataset status to ${status}`
      });
      return false;
    }
    
    // Verify the update was successful by directly checking the database again
    const isStatusConsistent = await validateDatasetStatus(id, status);
    if (!isStatusConsistent) {
      console.error('Status inconsistency detected after update');
      toast.error("Status inconsistency detected", {
        description: "The database and UI may be out of sync. Please refresh the page."
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating dataset status:', error);
    toast.error("Update failed", {
      description: "Failed to update dataset status"
    });
    return false;
  }
};

/**
 * Send feedback to the dataset contributor
 */
export const sendFeedbackToContributor = async (id: string, feedback: string): Promise<boolean> => {
  try {
    const success = await sendDatasetFeedback(id, feedback);
    if (success) {
      toast.success("Feedback sent", {
        description: "Feedback was successfully sent to contributor"
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending feedback:', error);
    toast.error("Feedback failed", {
      description: "Failed to send feedback"
    });
    return false;
  }
};

/**
 * Publish a dataset
 */
export const publishDataset = async (id: string): Promise<boolean> => {
  try {
    // First verify that the dataset is really approved in the database
    const { data: currentDataset, error: fetchError } = await supabase
      .from('datasets')
      .select('id, verification_status, title')
      .eq('id', id)
      .single();
      
    if (fetchError || !currentDataset) {
      console.error('Error verifying dataset status before publishing:', fetchError);
      toast.error("Publishing failed", {
        description: "Could not verify dataset status"
      });
      return false;
    }
    
    // Double-check the status
    if (currentDataset.verification_status !== 'approved') {
      console.error(`Dataset ${id} is not approved in the database. Current status:`, currentDataset.verification_status);
      toast.error("Publishing failed", {
        description: `Dataset must be approved before publishing. Current status in database: ${currentDataset.verification_status}`
      });
      return false;
    }
    
    // If verified, proceed with publishing
    const success = await publishDatasetService(id);
    return success;
  } catch (error) {
    console.error('Error publishing dataset:', error);
    toast.error("Publishing failed", {
      description: error instanceof Error ? error.message : "Failed to publish dataset"
    });
    return false;
  }
};
