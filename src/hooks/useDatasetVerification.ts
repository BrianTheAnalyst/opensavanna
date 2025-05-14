
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { DatasetWithEmail } from '@/types/dataset';
import { 
  fetchDatasetsWithVerificationStatus, 
  updateDatasetVerificationStatus,
  sendDatasetFeedback,
  publishDataset as publishDatasetService
} from '@/services/datasetVerificationService';

export const useDatasetVerification = () => {
  const [pendingDatasets, setPendingDatasets] = useState<DatasetWithEmail[]>([]);
  const [approvedDatasets, setApprovedDatasets] = useState<DatasetWithEmail[]>([]);
  const [rejectedDatasets, setRejectedDatasets] = useState<DatasetWithEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadDatasets = async () => {
    setIsLoading(true);

    try {
      // Load all datasets with their verification status
      const allDatasets = await fetchDatasetsWithVerificationStatus();
      
      console.log("All datasets loaded:", allDatasets);
      
      // Helper function to map database columns to TypeScript properties if needed
      const normalizeDataset = (dataset: any): DatasetWithEmail => {
        // Create a copy of the dataset with TypeScript properties
        return {
          ...dataset,
          verificationStatus: dataset.verificationStatus || dataset.verification_status || 'pending',
          verificationNotes: dataset.verificationNotes || dataset.verification_notes
        };
      };
      
      // Filter datasets by verification status - using the normalized property names
      const pending = allDatasets
        .filter(d => {
          // Use a temporary variable to check the status from either property name
          const status = d.verificationStatus || (d as any).verification_status;
          return !status || status === 'pending';
        })
        .map(normalizeDataset);
      
      const approved = allDatasets
        .filter(d => {
          // Use a temporary variable to check the status from either property name
          const status = d.verificationStatus || (d as any).verification_status;
          return status === 'approved';
        })
        .map(normalizeDataset);
      
      const rejected = allDatasets
        .filter(d => {
          // Use a temporary variable to check the status from either property name
          const status = d.verificationStatus || (d as any).verification_status;
          return status === 'rejected';
        })
        .map(normalizeDataset);
      
      console.log(`Filtered datasets: ${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected`);
      
      setPendingDatasets(pending);
      setApprovedDatasets(approved);
      setRejectedDatasets(rejected);
    } catch (error) {
      console.error('Error loading datasets:', error);
      toast.error('Failed to load datasets', {
        description: "Could not fetch datasets for verification"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    try {
      // First update in the database
      const result = await updateDatasetVerificationStatus(id, status, notes);
      
      if (!result.success) {
        console.error('Failed to update dataset status in database:', result.error);
        toast.error(`Update failed`, {
          description: `Failed to update dataset status to ${status}`
        });
        return;
      }
      
      // Get the updated dataset data from the result
      const updatedDataset = result.data;
      console.log('Dataset successfully updated in database:', updatedDataset);

      // Now update our local state based on the database confirmation
      if (status === 'approved') {
        // Find dataset in any of our lists
        let dataset = pendingDatasets.find(d => d.id === id);
        if (!dataset) {
          dataset = rejectedDatasets.find(d => d.id === id);
        }
        
        if (dataset) {
          // Create updated dataset with proper TypeScript properties
          const updatedDatasetWithEmail: DatasetWithEmail = { 
            ...dataset, 
            verificationStatus: status,
            verificationNotes: notes || dataset.verificationNotes
          };
          
          // Remove from current lists
          setPendingDatasets(prev => prev.filter(d => d.id !== id));
          setRejectedDatasets(prev => prev.filter(d => d.id !== id));
          
          // Add to approved list
          setApprovedDatasets(prev => [updatedDatasetWithEmail, ...prev]);
        }
      } else if (status === 'rejected') {
        // Find dataset
        let dataset = pendingDatasets.find(d => d.id === id);
        if (!dataset) {
          dataset = approvedDatasets.find(d => d.id === id);
        }
        
        if (dataset) {
          const updatedDatasetWithEmail: DatasetWithEmail = { 
            ...dataset, 
            verificationStatus: status,
            verificationNotes: notes || dataset.verificationNotes
          };
          
          setPendingDatasets(prev => prev.filter(d => d.id !== id));
          setApprovedDatasets(prev => prev.filter(d => d.id !== id));
          setRejectedDatasets(prev => [updatedDatasetWithEmail, ...prev]);
        }
      } else if (status === 'pending') {
        // Find dataset
        let dataset = approvedDatasets.find(d => d.id === id);
        if (!dataset) {
          dataset = rejectedDatasets.find(d => d.id === id);
        }
        
        if (dataset) {
          const updatedDatasetWithEmail: DatasetWithEmail = { 
            ...dataset, 
            verificationStatus: status,
            verificationNotes: notes || dataset.verificationNotes
          };
          
          setApprovedDatasets(prev => prev.filter(d => d.id !== id));
          setRejectedDatasets(prev => prev.filter(d => d.id !== id));
          setPendingDatasets(prev => [updatedDatasetWithEmail, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error updating dataset status:', error);
      toast.error("Update failed", {
        description: "Failed to update dataset status"
      });
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    try {
      const success = await sendDatasetFeedback(id, feedback);
      if (success) {
        toast.success("Feedback sent", {
          description: "Feedback was successfully sent to contributor"
        });
        // No need to move datasets between categories for feedback
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error("Feedback failed", {
        description: "Failed to send feedback"
      });
    }
  };
  
  const publishDataset = async (id: string): Promise<void> => {
    try {
      // First verify that the dataset is really approved in the database
      const { data: currentDataset, error: fetchError } = await supabase
        .from('datasets')
        .select('id, verification_status')
        .eq('id', id)
        .single();
        
      if (fetchError || !currentDataset) {
        console.error('Error verifying dataset status before publishing:', fetchError);
        toast.error("Publishing failed", {
          description: "Could not verify dataset status"
        });
        throw new Error("Failed to verify dataset status");
      }
      
      // Double-check the status
      if (currentDataset.verification_status !== 'approved') {
        console.error(`Dataset ${id} is not approved in the database. Current status:`, currentDataset.verification_status);
        toast.error("Publishing failed", {
          description: "Dataset must be approved before publishing"
        });
        throw new Error(`Dataset is not approved. Current status: ${currentDataset.verification_status}`);
      }
      
      // If verified, proceed with publishing
      const success = await publishDatasetService(id);
      if (success) {
        toast.success("Dataset published", {
          description: "The dataset has been successfully published"
        });
        // Update the dataset in the approved list to show as featured
        setApprovedDatasets(prev => prev.map(dataset => 
          dataset.id === id ? { ...dataset, featured: true } : dataset
        ));
      }
    } catch (error) {
      console.error('Error publishing dataset:', error);
      toast.error("Publishing failed", {
        description: error instanceof Error ? error.message : "Failed to publish dataset"
      });
      throw error;
    }
  };

  // Function to manually trigger refresh
  const refreshData = () => {
    console.log("Refreshing dataset verification data");
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    loadDatasets();
  }, [refreshTrigger]);

  return {
    pendingDatasets,
    approvedDatasets,
    rejectedDatasets,
    updateStatus,
    sendFeedback,
    publishDataset,
    isLoading,
    refreshData
  };
};

// Add missing import for supabase
import { supabase } from "@/integrations/supabase/client";
