
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
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
      
      // Filter datasets by verification status
      const pending = allDatasets.filter(d => {
        const status = d.verificationStatus || (d as any).verification_status;
        return !status || status === 'pending';
      });
      
      const approved = allDatasets.filter(d => {
        const status = d.verificationStatus || (d as any).verification_status;
        return status === 'approved';
      });
      
      const rejected = allDatasets.filter(d => {
        const status = d.verificationStatus || (d as any).verification_status;
        return status === 'rejected';
      });
      
      console.log(`Filtered datasets: ${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected`);
      
      setPendingDatasets(pending);
      setApprovedDatasets(approved);
      setRejectedDatasets(rejected);
    } catch (error) {
      console.error('Error loading datasets:', error);
      toast("Failed to load datasets", {
        description: "Could not fetch datasets for verification"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    try {
      const success = await updateDatasetVerificationStatus(id, status, notes);
      
      if (success) {
        toast(`Dataset ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'status updated'}`, {
          description: `The dataset has been ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated to pending'}${notes ? ' with notes' : ''}.`
        });
        
        // Update local state immediately to reflect changes - this is crucial for UI updates
        if (status === 'approved') {
          // Find dataset in any of our lists
          let dataset = pendingDatasets.find(d => d.id === id);
          if (!dataset) {
            dataset = rejectedDatasets.find(d => d.id === id);
          }
          
          if (dataset) {
            // Create updated dataset with new status
            const updatedDataset = { 
              ...dataset, 
              verificationStatus: status,
              verification_status: status, // Update both properties for compatibility
              verificationNotes: notes || dataset.verificationNotes || (dataset as any).verification_notes 
            };
            
            // Remove from current lists
            setPendingDatasets(prev => prev.filter(d => d.id !== id));
            setRejectedDatasets(prev => prev.filter(d => d.id !== id));
            
            // Add to approved list
            setApprovedDatasets(prev => [updatedDataset, ...prev]);
          }
        } else if (status === 'rejected') {
          // Find dataset
          let dataset = pendingDatasets.find(d => d.id === id);
          if (!dataset) {
            dataset = approvedDatasets.find(d => d.id === id);
          }
          
          if (dataset) {
            const updatedDataset = { 
              ...dataset, 
              verificationStatus: status,
              verification_status: status,
              verificationNotes: notes || dataset.verificationNotes || (dataset as any).verification_notes 
            };
            
            setPendingDatasets(prev => prev.filter(d => d.id !== id));
            setApprovedDatasets(prev => prev.filter(d => d.id !== id));
            setRejectedDatasets(prev => [updatedDataset, ...prev]);
          }
        } else if (status === 'pending') {
          // Find dataset
          let dataset = approvedDatasets.find(d => d.id === id);
          if (!dataset) {
            dataset = rejectedDatasets.find(d => d.id === id);
          }
          
          if (dataset) {
            const updatedDataset = { 
              ...dataset, 
              verificationStatus: status,
              verification_status: status,
              verificationNotes: notes || dataset.verificationNotes || (dataset as any).verification_notes 
            };
            
            setApprovedDatasets(prev => prev.filter(d => d.id !== id));
            setRejectedDatasets(prev => prev.filter(d => d.id !== id));
            setPendingDatasets(prev => [updatedDataset, ...prev]);
          }
        }
      }
    } catch (error) {
      console.error('Error updating dataset status:', error);
      toast("Update failed", {
        description: "Failed to update dataset status"
      });
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    try {
      const success = await sendDatasetFeedback(id, feedback);
      if (success) {
        toast("Feedback sent", {
          description: "Feedback was successfully sent to contributor"
        });
        // No need to move datasets between categories for feedback
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast("Feedback failed", {
        description: "Failed to send feedback"
      });
    }
  };
  
  const publishDataset = async (id: string): Promise<void> => {
    try {
      const success = await publishDatasetService(id);
      if (success) {
        toast("Dataset published", {
          description: "The dataset has been successfully published"
        });
        // Update the dataset in the approved list to show as featured
        setApprovedDatasets(prev => prev.map(dataset => 
          dataset.id === id ? { ...dataset, featured: true } : dataset
        ));
      }
    } catch (error) {
      console.error('Error publishing dataset:', error);
      toast("Publishing failed", {
        description: "Failed to publish dataset"
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
