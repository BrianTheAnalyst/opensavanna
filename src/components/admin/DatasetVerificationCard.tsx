
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
    
    try {
      setIsPublishing(true);
      await publishDataset(dataset.id);
      // Toast notification is handled in the publishDataset function
    } catch (error) {
      toast("Failed to publish dataset", {
        description: "There was an error publishing this dataset. Please try again."
      });
      console.error("Publishing error:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  // Determine the effective verification status
  const effectiveStatus = dataset.verificationStatus || (dataset as any).verification_status || 'pending';

  return (
    <div className="border rounded-lg p-6 bg-background">
      <DatasetInfo dataset={dataset} />
      
      <DatasetActionButtons 
        status={effectiveStatus as 'pending' | 'approved' | 'rejected'}
        datasetId={dataset.id}
        onApprove={handleApprove}
        onReject={handleReject}
        onFeedback={handleFeedback}
        updateStatus={updateStatus}
        publishDataset={effectiveStatus === 'approved' ? handlePublish : undefined}
        isPublishing={isPublishing}
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
