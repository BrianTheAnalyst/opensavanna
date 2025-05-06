
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { DatasetWithEmail, VerificationStatus } from "@/types/dataset";
import { isUserAdmin } from '@/services/userRoleService';
import { useNavigate } from 'react-router-dom';
import { 
  fetchDatasetsByVerificationStatus, 
  updateDatasetVerificationStatus, 
  sendBatchNotifications 
} from '@/services/datasetVerificationService';

export const useDatasetVerification = () => {
  const [datasets, setDatasets] = useState<DatasetWithEmail[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetWithEmail | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<VerificationStatus>('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      // Check if user is admin
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        toast.error('You do not have permission to access this page');
        navigate('/');
        return;
      }
      
      await loadDatasets();
    };
    
    checkAdminAndLoadData();
  }, [navigate, activeTab]);
  
  // Load datasets based on active tab
  const loadDatasets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDatasetsByVerificationStatus(activeTab);
      setDatasets(data);
      // Clear selection when datasets change
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle dataset processed event
  const handleDatasetProcessed = (datasetId: string) => {
    setDatasets(datasets.filter(d => d.id !== datasetId));
    setSelectedDataset(null);
    // Remove from selected IDs if present
    if (selectedIds.has(datasetId)) {
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(datasetId);
      setSelectedIds(newSelectedIds);
    }
  };
  
  // Handle batch approval
  const handleBatchApprove = async () => {
    await processBatch('approve');
  };
  
  // Handle batch rejection
  const handleBatchReject = async () => {
    await processBatch('reject');
  };
  
  // Process batch of datasets
  const processBatch = async (action: 'approve' | 'reject') => {
    if (selectedIds.size === 0) return;
    
    setIsBatchProcessing(true);
    const selectedIdsArray = Array.from(selectedIds);
    
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      // Update datasets with correct status handling
      const success = await updateDatasetVerificationStatus(selectedIdsArray, status);
      
      if (!success) throw new Error('Failed to update datasets');
      
      // Send notification emails - only use valid 'approved' or 'rejected' status
      const selectedDatasets = datasets.filter(dataset => selectedIds.has(dataset.id));
      await sendBatchNotifications(selectedDatasets, status);
      
      toast.success(`${selectedIds.size} datasets ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Refresh the list
      await loadDatasets();
    } catch (error) {
      console.error(`Error processing batch ${action}:`, error);
      toast.error(`Failed to ${action} datasets`);
    } finally {
      setIsBatchProcessing(false);
      setSelectedIds(new Set());
    }
  };
  
  // Toggle dataset selection
  const toggleDatasetSelection = (datasetId: string, selected: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    
    if (selected) {
      newSelectedIds.add(datasetId);
    } else {
      newSelectedIds.delete(datasetId);
    }
    
    setSelectedIds(newSelectedIds);
  };
  
  // Clear all selections
  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return {
    datasets,
    selectedDataset,
    selectedIds,
    isLoading,
    isBatchProcessing,
    isAdmin,
    activeTab,
    setActiveTab,
    setSelectedDataset,
    handleDatasetProcessed,
    handleBatchApprove,
    handleBatchReject,
    toggleDatasetSelection,
    clearSelection
  };
};

export default useDatasetVerification;
