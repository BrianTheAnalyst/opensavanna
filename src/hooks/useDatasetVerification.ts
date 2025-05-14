
import { useState, useEffect } from 'react';
import { DatasetWithEmail } from '@/types/dataset';
import { 
  loadAllDatasets,
  updateStatus,
  sendFeedbackToContributor,
  publishDataset as publishDatasetAction
} from './verification/datasetVerificationService';

export const useDatasetVerification = () => {
  const [pendingDatasets, setPendingDatasets] = useState<DatasetWithEmail[]>([]);
  const [approvedDatasets, setApprovedDatasets] = useState<DatasetWithEmail[]>([]);
  const [rejectedDatasets, setRejectedDatasets] = useState<DatasetWithEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastOperationSuccess, setLastOperationSuccess] = useState<boolean | null>(null);

  const loadDatasets = async () => {
    setIsLoading(true);

    try {
      const { pending, approved, rejected } = await loadAllDatasets();
      
      setPendingDatasets(pending);
      setApprovedDatasets(approved);
      setRejectedDatasets(rejected);
    } catch (error) {
      console.error('Error in useDatasetVerification hook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDatasetStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    try {
      console.log(`Attempting to update dataset ${id} to status: ${status}`);
      
      // First update in the database
      const success = await updateStatus(id, status, notes);
      setLastOperationSuccess(success);
      
      if (!success) return;
      
      // Force refresh datasets from the database to ensure UI is in sync
      refreshData();
      
      // This local update is now only for optimistic UI updates while the refresh happens
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
      setLastOperationSuccess(false);
      console.error('Error updating dataset status:', error);
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    const success = await sendFeedbackToContributor(id, feedback);
    setLastOperationSuccess(success);
    // No need to move datasets between categories for feedback
  };
  
  const publishDataset = async (id: string): Promise<void> => {
    try {
      const success = await publishDatasetAction(id);
      setLastOperationSuccess(success);
      
      if (success) {
        // Refresh all data after publishing to ensure UI is in sync
        refreshData();
        
        // Update the dataset in the approved list to show as featured (optimistic update)
        setApprovedDatasets(prev => prev.map(dataset => 
          dataset.id === id ? { ...dataset, featured: true } : dataset
        ));
      }
    } catch (error) {
      setLastOperationSuccess(false);
      // Error is already handled in the service
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
    updateStatus: updateDatasetStatus,
    sendFeedback,
    publishDataset,
    isLoading,
    refreshData,
    lastOperationSuccess
  };
};
