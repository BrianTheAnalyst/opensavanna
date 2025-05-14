
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatasetWithEmail } from '@/types/dataset';
import DialogTitleContent from './verification/DialogTitle';
import FeedbackTabs from './verification/FeedbackTabs';
import NotesField from './verification/NotesField';
import DialogActions from './verification/DialogActions';

interface DatasetReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: DatasetWithEmail;
  action: 'approve' | 'reject' | 'feedback';
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
  sendFeedback?: (id: string, feedback: string) => Promise<void>;
}

const DatasetReviewDialog = ({ 
  open, 
  onOpenChange, 
  dataset, 
  action,
  updateStatus,
  sendFeedback
}: DatasetReviewDialogProps) => {
  const [notes, setNotes] = useState(dataset.verificationNotes || '');
  const [feedbackTab, setFeedbackTab] = useState<'notes' | 'email'>('notes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (action === 'feedback' && sendFeedback) {
        await sendFeedback(dataset.id, notes);
      } else {
        await updateStatus(
          dataset.id, 
          action === 'approve' ? 'approved' : 'rejected',
          notes.trim() || undefined
        );
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isSubmitDisabled = () => {
    return (action === 'reject' && !notes.trim()) || 
           (action === 'feedback' && !notes.trim());
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DialogTitleContent action={action} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-2">{dataset.title}</h3>
          
          <div className="mb-4">
            {action === 'feedback' ? (
              <FeedbackTabs 
                dataset={dataset}
                feedbackTab={feedbackTab}
                setFeedbackTab={setFeedbackTab}
                notes={notes}
                setNotes={setNotes}
              />
            ) : (
              <NotesField 
                action={action} 
                notes={notes} 
                setNotes={setNotes} 
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <DialogActions 
            action={action}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
            isDisabled={isSubmitDisabled()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetReviewDialog;
