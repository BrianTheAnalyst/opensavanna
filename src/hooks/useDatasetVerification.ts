
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
      // First update in the database
      const success = await updateStatus(id, status, notes);
      setLastOperationSuccess(success);
      
      if (!success) return;
      
      // Force refresh datasets from the database to ensure UI is in sync
      refreshData();
    } catch (error) {
      setLastOperationSuccess(false);
      console.error('Error updating dataset status:', error);
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    const success = await sendFeedbackToContributor(id, feedback);
    setLastOperationSuccess(success);
  };
  
  const publishDataset = async (id: string): Promise<void> => {
    try {
      const success = await publishDatasetAction(id);
      setLastOperationSuccess(success);
      
      if (success) {
        // Refresh all data after publishing to ensure UI is in sync
        refreshData();
      }
    } catch (error) {
      setLastOperationSuccess(false);
      throw error;
    }
  };

  // Function to manually trigger refresh
  const refreshData = () => {
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
