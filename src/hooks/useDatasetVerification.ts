
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatasetWithEmail } from "@/types/dataset";
import { isUserAdmin } from '@/services/userRoleService';
import { useNavigate } from 'react-router-dom';

export const useDatasetVerification = () => {
  const [datasets, setDatasets] = useState<DatasetWithEmail[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetWithEmail | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
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
      // Query datasets with verification status matching the active tab
      const { data, error } = await supabase
        .from('datasets')
        .select('*, users:user_id(email)')
        .eq('verificationStatus', activeTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedData: DatasetWithEmail[] = (data || []).map(item => ({
        ...item,
        email: item.users?.email || 'Unknown',
        verificationStatus: item.verificationStatus || 'pending',
        downloads: item.downloads || 0
      } as DatasetWithEmail));
      
      setDatasets(formattedData);
      // Clear selection when datasets change
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Error loading datasets:', error);
      toast.error('Failed to load datasets');
    } finally {
      setIsLoading(false);
    }
  };

  // Send notification emails for batch operations
  const sendBatchNotifications = async (datasetIds: string[], status: 'approved' | 'rejected') => {
    try {
      // Filter datasets by the selected IDs
      const selectedDatasets = datasets.filter(dataset => datasetIds.includes(dataset.id));
      
      // Send notification for each dataset
      const emailPromises = selectedDatasets.map(dataset => {
        if (!dataset.email) {
          console.warn(`No email available for dataset ${dataset.id}`);
          return Promise.resolve();
        }
        
        return fetch('https://dwngyvatnoeyoaplwoba.supabase.co/functions/v1/send-dataset-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: dataset.email,
            datasetTitle: dataset.title,
            status: status,
            feedback: status === 'approved' 
              ? 'Your dataset has been approved in our batch review process.' 
              : 'Your dataset was rejected during our review process. Please review our dataset guidelines and consider resubmitting.'
          }),
        }).catch(error => {
          console.error(`Failed to send notification for dataset ${dataset.id}:`, error);
        });
      });
      
      await Promise.all(emailPromises);
      console.log(`Batch notifications sent for ${status} datasets`);
    } catch (error) {
      console.error('Error sending batch notifications:', error);
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
      const updateData = {
        verificationStatus: action === 'approve' ? 'approved' : 'rejected',
        verified: action === 'approve',
        verifiedAt: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('datasets')
        .update(updateData)
        .in('id', selectedIdsArray);
      
      if (error) throw error;
      
      // Send notification emails
      await sendBatchNotifications(selectedIdsArray, action === 'approve' ? 'approved' : 'rejected');
      
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
