
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatasetVerification } from '@/hooks/useDatasetVerification';
import DatasetVerificationList from './DatasetVerificationList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const VerificationTabs = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { 
    pendingDatasets, 
    approvedDatasets, 
    rejectedDatasets, 
    updateStatus,
    sendFeedback,
    publishDataset,
    isLoading,
    refreshData,
    lastOperationSuccess
  } = useDatasetVerification();

  // Effect to watch for operation results and show feedback
  useEffect(() => {
    if (lastOperationSuccess === false) {
      toast.error("Operation failed", {
        description: "Check browser console for more details"
      });
    }
  }, [lastOperationSuccess]);

  const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    console.log(`VerificationTabs: Updating dataset ${id} to status ${status}`);
    await updateStatus(id, status, notes);
    
    // Auto-switch to the appropriate tab after status update
    if (status === 'approved') {
      console.log('Switching to approved tab');
      setActiveTab('approved');
    } else if (status === 'rejected') {
      console.log('Switching to rejected tab');
      setActiveTab('rejected');
    } else if (status === 'pending') {
      console.log('Switching to pending tab');
      setActiveTab('pending');
    }
  };

  // Monitor datasets for debugging
  useEffect(() => {
    console.log("Dataset counts: ", {
      pending: pendingDatasets.length,
      approved: approvedDatasets.length, 
      rejected: rejectedDatasets.length
    });
    
    // Log each approved dataset for debugging
    if (approvedDatasets.length > 0) {
      console.log("Approved datasets:", approvedDatasets.map(d => ({
        id: d.id,
        title: d.title,
        status: d.verificationStatus || (d as any).verification_status
      })));
    }
  }, [pendingDatasets, approvedDatasets, rejectedDatasets]);

  // Handle refresh button click with feedback
  const handleRefresh = () => {
    refreshData();
    toast.info("Refreshing data", {
      description: "Getting latest dataset information from the database"
    });
  };

  return (
    <Tabs 
      defaultValue="pending" 
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pending Review
            {pendingDatasets.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-background text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                {pendingDatasets.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <TabsContent value="pending" className="mt-0">
        <DatasetVerificationList 
          datasets={pendingDatasets}
          status="pending" 
          updateStatus={handleUpdateStatus}
          sendFeedback={sendFeedback}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="approved" className="mt-0">
        <DatasetVerificationList 
          datasets={approvedDatasets}
          status="approved" 
          updateStatus={handleUpdateStatus}
          sendFeedback={sendFeedback}
          publishDataset={publishDataset}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="rejected" className="mt-0">
        <DatasetVerificationList 
          datasets={rejectedDatasets}
          status="rejected" 
          updateStatus={handleUpdateStatus}
          sendFeedback={sendFeedback}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default VerificationTabs;
