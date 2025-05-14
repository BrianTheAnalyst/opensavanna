
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { DatasetWithEmail } from '@/types/dataset';
import { 
  fetchDatasetsWithVerificationStatus, 
  updateDatasetVerificationStatus,
  sendDatasetFeedback
} from '@/services/datasetVerificationService';
import { useNavigate } from 'react-router-dom';

export const useDatasetVerification = () => {
  const [pendingDatasets, setPendingDatasets] = useState<DatasetWithEmail[]>([]);
  const [approvedDatasets, setApprovedDatasets] = useState<DatasetWithEmail[]>([]);
  const [rejectedDatasets, setRejectedDatasets] = useState<DatasetWithEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      toast.error('Failed to load datasets');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    try {
      await updateDatasetVerificationStatus(id, status, notes);
      toast.success(`Dataset ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'set to pending'}`);
      await loadDatasets(); // Reload data after update
    } catch (error) {
      console.error('Error updating dataset status:', error);
      toast.error('Failed to update dataset status');
    }
  };
  
  const sendFeedback = async (id: string, feedback: string) => {
    try {
      await sendDatasetFeedback(id, feedback);
      toast.success('Feedback sent to contributor');
      await loadDatasets(); // Reload data after update
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback');
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  return {
    pendingDatasets,
    approvedDatasets,
    rejectedDatasets,
    updateStatus,
    sendFeedback,
    isLoading,
    refreshData: loadDatasets
  };
};
