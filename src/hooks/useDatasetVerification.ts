
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { DatasetWithEmail } from '@/types/dataset';
import { 
  fetchDatasetsWithVerificationStatus, 
  updateDatasetVerificationStatus
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
      
      // Filter by verification status
      setPendingDatasets(allDatasets.filter(d => d.verificationStatus === 'pending' || !d.verificationStatus));
      setApprovedDatasets(allDatasets.filter(d => d.verificationStatus === 'approved'));
      setRejectedDatasets(allDatasets.filter(d => d.verificationStatus === 'rejected'));
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
      await loadDatasets(); // Reload data after update
    } catch (error) {
      console.error('Error updating dataset status:', error);
      toast.error('Failed to update dataset status');
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
    isLoading,
    refreshData: loadDatasets
  };
};
