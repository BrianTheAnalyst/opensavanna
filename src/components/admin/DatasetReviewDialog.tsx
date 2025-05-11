
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { DatasetWithEmail } from '@/types/dataset';

interface DatasetReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: DatasetWithEmail;
  action: 'approve' | 'reject';
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
}

const DatasetReviewDialog = ({ 
  open, 
  onOpenChange, 
  dataset, 
  action,
  updateStatus
}: DatasetReviewDialogProps) => {
  const [notes, setNotes] = useState(dataset.verificationNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await updateStatus(
      dataset.id, 
      action === 'approve' ? 'approved' : 'rejected',
      notes.trim() || undefined
    );
    setIsSubmitting(false);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {action === 'approve' ? (
              <>
                <Check className="w-5 h-5 mr-2 text-emerald-500" />
                Approve Dataset
              </>
            ) : (
              <>
                <X className="w-5 h-5 mr-2 text-destructive" />
                Reject Dataset
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-2">{dataset.title}</h3>
          
          <div className="mb-4">
            <label className="text-sm text-foreground/70 mb-1 block">
              {action === 'approve' 
                ? 'Add any notes or comments (optional)' 
                : 'Please provide a reason for rejection'}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={action === 'approve' 
                ? 'Add any notes or comments...' 
                : 'Reason for rejection...'}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (action === 'reject' && !notes.trim())}
            variant={action === 'approve' ? 'default' : 'destructive'}
          >
            {isSubmitting 
              ? 'Processing...' 
              : action === 'approve' 
                ? 'Approve Dataset' 
                : 'Reject Dataset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetReviewDialog;
