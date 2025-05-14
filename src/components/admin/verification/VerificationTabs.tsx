
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatasetVerification } from '@/hooks/useDatasetVerification';
import DatasetVerificationList from './DatasetVerificationList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const VerificationTabs = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { 
    pendingDatasets, 
    approvedDatasets, 
    rejectedDatasets, 
    updateStatus,
    sendFeedback,
    isLoading,
    refreshData
  } = useDatasetVerification();

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
        
        <Button variant="outline" size="sm" onClick={refreshData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <TabsContent value="pending" className="mt-0">
        <DatasetVerificationList 
          datasets={pendingDatasets}
          status="pending" 
          updateStatus={updateStatus}
          sendFeedback={sendFeedback}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="approved" className="mt-0">
        <DatasetVerificationList 
          datasets={approvedDatasets}
          status="approved" 
          updateStatus={updateStatus}
          sendFeedback={sendFeedback}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="rejected" className="mt-0">
        <DatasetVerificationList 
          datasets={rejectedDatasets}
          status="rejected" 
          updateStatus={updateStatus}
          sendFeedback={sendFeedback}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default VerificationTabs;
