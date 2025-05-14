
import { useState } from 'react';
import { DatasetWithEmail } from '@/types/dataset';
import DatasetReviewDialog from './DatasetReviewDialog';
import DatasetInfo from './verification/DatasetInfo';
import DatasetActionButtons from './verification/DatasetActionButtons';
import { toast } from "@/hooks/use-toast";

interface DatasetVerificationCardProps {
  dataset: DatasetWithEmail;
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
  sendFeedback?: (id: string, feedback: string) => Promise<void>;
  publishDataset?: (id: string) => Promise<void>;
}

const DatasetVerificationCard = ({ dataset, updateStatus, sendFeedback, publishDataset }: DatasetVerificationCardProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'feedback'>('approve');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handleApprove = () => {
    setReviewAction('approve');
    setIsReviewDialogOpen(true);
  };

  const handleReject = () => {
    setReviewAction('reject');
    setIsReviewDialogOpen(true);
  };
  
  const handleFeedback = () => {
    setReviewAction('feedback');
    setIsReviewDialogOpen(true);
  };

  const handlePublish = async () => {
    if (!publishDataset) return;
    
    // Reset any previous error state
    setPublishError(null);
    
    try {
      setIsPublishing(true);
      await publishDataset(dataset.id);
      // Toast notification is handled in the publishDataset function
    } catch (error) {
      // Enhanced error handling with more context
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
        
      console.error(`Publishing error for dataset ${dataset.id} (${dataset.title}):`, error);
      
      setPublishError(errorMessage);
      
      toast("Failed to publish dataset", {
        description: `There was an error publishing "${dataset.title}". Please try again later.`
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Determine the effective verification status
  const effectiveStatus = dataset.verificationStatus || (dataset as any).verification_status || 'pending';

  return (
    <div className="border rounded-lg p-6 bg-background">
      <DatasetInfo dataset={dataset} />
      
      {/* Show error message if publish failed */}
      {publishError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
          <p className="font-semibold">Publishing failed</p>
          <p>{publishError}</p>
        </div>
      )}
      
      <DatasetActionButtons 
        status={effectiveStatus as 'pending' | 'approved' | 'rejected'}
        datasetId={dataset.id}
        onApprove={handleApprove}
        onReject={handleReject}
        onFeedback={handleFeedback}
        updateStatus={updateStatus}
        publishDataset={effectiveStatus === 'approved' ? handlePublish : undefined}
        isPublishing={isPublishing}
        hasError={!!publishError}
      />
      
      <DatasetReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        dataset={dataset}
        action={reviewAction}
        updateStatus={updateStatus}
        sendFeedback={sendFeedback}
      />
    </div>
  );
};

export default DatasetVerificationCard;
