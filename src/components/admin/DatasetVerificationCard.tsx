
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, FileText, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatasetReviewDialog from './DatasetReviewDialog';
import { DatasetWithEmail } from '@/types/dataset';
import { Badge } from '@/components/ui/badge';

interface DatasetVerificationCardProps {
  dataset: DatasetWithEmail;
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
}

const DatasetVerificationCard = ({ dataset, updateStatus }: DatasetVerificationCardProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

  const handleApprove = () => {
    setReviewAction('approve');
    setIsReviewDialogOpen(true);
  };

  const handleReject = () => {
    setReviewAction('reject');
    setIsReviewDialogOpen(true);
  };

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
            dataset.verificationStatus === 'approved'
              ? 'success'
              : dataset.verificationStatus === 'rejected'
              ? 'destructive'
              : 'outline'
          }
        >
          {dataset.verificationStatus === 'approved'
            ? 'Approved'
            : dataset.verificationStatus === 'rejected'
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
      
      {dataset.verificationStatus === 'pending' && (
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
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
        </div>
      )}
      
      {dataset.verificationStatus !== 'pending' && (
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => updateStatus(dataset.id, 'pending')}
          >
            Reset to Pending
          </Button>
        </div>
      )}
      
      <DatasetReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        dataset={dataset}
        action={reviewAction}
        updateStatus={updateStatus}
      />
    </div>
  );
};

export default DatasetVerificationCard;
