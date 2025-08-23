
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { 
  fetchDatasetsWithVerificationStatus,
  updateDatasetVerificationStatus,
  sendDatasetFeedback,
  publishDataset as publishDatasetService
} from '@/services/verification';
import { DatasetWithEmail } from '@/types/dataset';

import { normalizeDataset } from './datasetVerificationUtils';

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
    
    console.log("All datasets loaded:", allDatasets);
    
    // Process and normalize all datasets first
    const normalizedDatasets = allDatasets.map(normalizeDataset);
    
    // Then filter the normalized datasets
    const pending = normalizedDatasets.filter(d => 
      !d.verificationStatus || d.verificationStatus === 'pending'
    );
    
    const approved = normalizedDatasets.filter(d => 
      d.verificationStatus === 'approved'
    );
    
    const rejected = normalizedDatasets.filter(d => 
      d.verificationStatus === 'rejected'
    );
    
    console.log(`Filtered datasets: ${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected`);
    
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
    console.log(`Attempting to update dataset ${id} to status: ${status}`);
    
    // First update in the database
    const result = await updateDatasetVerificationStatus(id, status, notes);
    
    if (!result.success) {
      console.error('Failed to update dataset status in database:', result.error);
      toast.error(`Update failed`, {
        description: `Failed to update dataset status to ${status}`
      });
      return false;
    }
    
    console.log('Dataset successfully updated in database:', result.data);
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
      throw new Error("Failed to verify dataset status");
    }
    
    // Extra logging to help debug
    console.log(`Publishing check for dataset ${id} (${currentDataset.title}): verification_status = ${currentDataset.verification_status}`);
    
    // Double-check the status
    if (currentDataset.verification_status !== 'approved') {
      console.error(`Dataset ${id} is not approved in the database. Current status:`, currentDataset.verification_status);
      toast.error("Publishing failed", {
        description: `Dataset must be approved before publishing. Current status in database: ${currentDataset.verification_status}`
      });
      throw new Error(`Dataset is not approved. Current status: ${currentDataset.verification_status}`);
    }
    
    // If verified, proceed with publishing
    const success = await publishDatasetService(id);
    if (success) {
      toast.success("Dataset published", {
        description: "The dataset has been successfully published"
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error publishing dataset:', error);
    toast.error("Publishing failed", {
      description: error instanceof Error ? error.message : "Failed to publish dataset"
    });
    throw error;
  }
};
