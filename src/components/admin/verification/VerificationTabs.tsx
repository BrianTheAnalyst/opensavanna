
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatasetVerification } from '@/hooks/useDatasetVerification';
import DatasetVerificationList from './DatasetVerificationList';

const VerificationTabs = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { 
    pendingDatasets, 
    approvedDatasets, 
    rejectedDatasets, 
    updateStatus,
    sendFeedback,
    isLoading
  } = useDatasetVerification();

  return (
    <Tabs 
      defaultValue="pending" 
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-8">
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
