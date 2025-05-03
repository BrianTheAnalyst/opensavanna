
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BatchActionBar from '@/components/admin/BatchActionBar';
import DatasetReviewDialog from '@/components/admin/DatasetReviewDialog';
import VerificationTabs from '@/components/admin/verification/VerificationTabs';
import DatasetList from '@/components/admin/verification/DatasetList';
import useDatasetVerification from '@/hooks/useDatasetVerification';

const DatasetVerificationPage = () => {
  const {
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
  } = useDatasetVerification();
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 mx-auto py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-medium mb-2">Dataset Verification</h1>
            <p className="text-foreground/70 mb-6">
              Review and verify submitted datasets before they are published to the African Data Commons
            </p>
            
            <VerificationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Batch Action Bar */}
            <BatchActionBar 
              selectedCount={selectedIds.size}
              onBatchApprove={handleBatchApprove}
              onBatchReject={handleBatchReject}
              onClearSelection={clearSelection}
              isProcessing={isBatchProcessing}
            />
            
            <DatasetList
              datasets={datasets}
              isLoading={isLoading}
              activeTab={activeTab}
              selectedIds={selectedIds}
              onReview={setSelectedDataset}
              onSelect={toggleDatasetSelection}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Dataset Review Dialog */}
      <DatasetReviewDialog
        dataset={selectedDataset}
        onClose={() => setSelectedDataset(null)}
        onProcessed={handleDatasetProcessed}
      />
    </div>
  );
};

export default DatasetVerificationPage;
