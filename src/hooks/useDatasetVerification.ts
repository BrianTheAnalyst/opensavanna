
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
      
      if (!success) return;
      
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
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    await sendFeedbackToContributor(id, feedback);
    // No need to move datasets between categories for feedback
  };
  
  const publishDataset = async (id: string): Promise<void> => {
    try {
      const success = await publishDatasetAction(id);
      
      if (success) {
        // Update the dataset in the approved list to show as featured
        setApprovedDatasets(prev => prev.map(dataset => 
          dataset.id === id ? { ...dataset, featured: true } : dataset
        ));
      }
    } catch (error) {
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
    refreshData
  };
};
