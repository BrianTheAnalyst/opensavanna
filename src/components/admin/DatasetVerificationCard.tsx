
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, FileText, User, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatasetReviewDialog from './DatasetReviewDialog';
import { DatasetWithEmail } from '@/types/dataset';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

interface DatasetVerificationCardProps {
  dataset: DatasetWithEmail;
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
  sendFeedback?: (id: string, feedback: string) => Promise<void>;
}

const DatasetVerificationCard = ({ dataset, updateStatus, sendFeedback }: DatasetVerificationCardProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'feedback'>('approve');

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

  // For debugging - log the verification status to see what's happening
  console.log(`Dataset ${dataset.id} status: ${dataset.verificationStatus || 'undefined'}`);
  console.log(`Dataset verification data:`, {
    id: dataset.id,
    title: dataset.title,
    status: dataset.verificationStatus,
    db_status: (dataset as any).verification_status,
  });

  // Determine the effective verification status, considering both TypeScript property and DB column
  const effectiveStatus = dataset.verificationStatus || (dataset as any).verification_status || 'pending';

  return (
    <div className="border rounded-lg p-6 bg-background">
      <div className="flex items-start justify-between mb-4">
        <Link to={`/datasets/${dataset.id}`}>
          <h3 className="text-lg font-medium hover:text-primary transition-colors">
            {dataset.title}
          </h3>
        </Link>
        
        <Badge
          variant={
            effectiveStatus === 'approved'
              ? 'success'
              : effectiveStatus === 'rejected'
              ? 'destructive'
              : 'outline'
          }
          className={effectiveStatus === 'pending' ? "bg-yellow-100 text-yellow-800" : ""}
        >
          {effectiveStatus === 'approved'
            ? 'Approved'
            : effectiveStatus === 'rejected'
            ? 'Rejected'
            : 'Pending Review'}
        </Badge>
      </div>
      
      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
        {dataset.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <FileText className="w-4 h-4" />
          <span>{dataset.format}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <User className="w-4 h-4" />
          <span title={dataset.userEmail || 'Unknown'}>
            {dataset.userEmail 
              ? dataset.userEmail.length > 15 
                ? dataset.userEmail.substring(0, 15) + '...'
                : dataset.userEmail
              : 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <Calendar className="w-4 h-4" />
          <span>{dataset.date}</span>
        </div>
      </div>

      {dataset.verificationNotes && (
        <div className="bg-muted/40 p-3 rounded-md mb-4 text-sm">
          <p className="font-medium mb-1">Notes:</p>
          <p className="text-foreground/70">{dataset.verificationNotes}</p>
        </div>
      )}
      
      {effectiveStatus === 'pending' && (
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1 border-green-300 text-green-800 hover:bg-green-100"
            onClick={handleApprove}
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleReject}
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleFeedback}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </div>
      )}
      
      {effectiveStatus !== 'pending' && (
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              updateStatus(dataset.id, 'pending')
                .then(() => toast.success("Status reset to pending"))
                .catch(err => toast.error("Failed to reset status"));
            }}
          >
            Reset to Pending
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleFeedback}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </div>
      )}
      
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
