
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
      toast({
        title: "Failed to load datasets",
        description: "Could not fetch datasets for verification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    try {
      const success = await updateDatasetVerificationStatus(id, status, notes);
      
      if (success) {
        toast({
          title: `Dataset ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'status updated'}`,
          description: `The dataset has been ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated to pending'}${notes ? ' with notes' : ''}.`
        });
        
        // Update local state to immediately reflect changes
        // This helps avoid having to wait for the next refresh
        if (status === 'approved') {
          // Move from pending to approved
          const dataset = pendingDatasets.find(d => d.id === id);
          if (dataset) {
            const updatedDataset = { ...dataset, verificationStatus: status, verificationNotes: notes || dataset.verificationNotes };
            setPendingDatasets(prev => prev.filter(d => d.id !== id));
            setApprovedDatasets(prev => [updatedDataset, ...prev]);
          }
        } else if (status === 'rejected') {
          // Move from pending to rejected
          const dataset = pendingDatasets.find(d => d.id === id);
          if (dataset) {
            const updatedDataset = { ...dataset, verificationStatus: status, verificationNotes: notes || dataset.verificationNotes };
            setPendingDatasets(prev => prev.filter(d => d.id !== id));
            setRejectedDatasets(prev => [updatedDataset, ...prev]);
          }
        } else if (status === 'pending') {
          // Move back to pending from either approved or rejected
          let dataset = approvedDatasets.find(d => d.id === id);
          if (!dataset) {
            dataset = rejectedDatasets.find(d => d.id === id);
          }
          
          if (dataset) {
            const updatedDataset = { ...dataset, verificationStatus: status, verificationNotes: notes || dataset.verificationNotes };
            setApprovedDatasets(prev => prev.filter(d => d.id !== id));
            setRejectedDatasets(prev => prev.filter(d => d.id !== id));
            setPendingDatasets(prev => [updatedDataset, ...prev]);
          }
        }
        
        // Still trigger a full refresh to ensure consistency with server
        refreshData();
      }
    } catch (error) {
      console.error('Error updating dataset status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update dataset status",
        variant: "destructive"
      });
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    try {
      const success = await sendDatasetFeedback(id, feedback);
      if (success) {
        toast({
          title: "Feedback sent",
          description: "Feedback was successfully sent to contributor"
        });
        await refreshData();
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Feedback failed",
        description: "Failed to send feedback",
        variant: "destructive"
      });
    }
  };
  
  const publishDataset = async (id: string) => {
    try {
      const success = await publishDatasetService(id);
      if (success) {
        toast({
          title: "Dataset published",
          description: "The dataset has been successfully published"
        });
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('Error publishing dataset:', error);
      toast({
        title: "Publishing failed",
        description: "Failed to publish dataset",
        variant: "destructive"
      });
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
    updateStatus,
    sendFeedback,
    publishDataset,
    isLoading,
    refreshData
  };
};
