
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare } from "lucide-react";
import { DatasetWithEmail } from '@/types/dataset';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    
    if (action === 'feedback' && sendFeedback) {
      await sendFeedback(dataset.id, notes);
    } else {
      await updateStatus(
        dataset.id, 
        action === 'approve' ? 'approved' : 'rejected',
        notes.trim() || undefined
      );
    }
    
    setIsSubmitting(false);
    onOpenChange(false);
  };
  
  const getDialogTitle = () => {
    switch (action) {
      case 'approve':
        return (
          <>
            <Check className="w-5 h-5 mr-2 text-emerald-500" />
            Approve Dataset
          </>
        );
      case 'reject':
        return (
          <>
            <X className="w-5 h-5 mr-2 text-destructive" />
            Reject Dataset
          </>
        );
      case 'feedback':
        return (
          <>
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Send Feedback
          </>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-2">{dataset.title}</h3>
          
          {action === 'feedback' ? (
            <div className="mb-4">
              <Tabs value={feedbackTab} onValueChange={(v) => setFeedbackTab(v as 'notes' | 'email')}>
                <TabsList className="mb-2">
                  <TabsTrigger value="notes">Add Notes</TabsTrigger>
                  <TabsTrigger value="email">Email Contributor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notes">
                  <label className="text-sm text-foreground/70 mb-1 block">
                    Add feedback notes to this dataset
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes for improvement..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    These notes will be visible to the contributor when they view their dataset.
                  </p>
                </TabsContent>
                
                <TabsContent value="email">
                  <label className="text-sm text-foreground/70 mb-1 block">
                    Send feedback to contributor via email
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write feedback to send to the contributor..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This message will be sent to {dataset.userEmail || 'the contributor'}
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
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
          )}
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
            disabled={isSubmitting || (action === 'reject' && !notes.trim()) || (action === 'feedback' && !notes.trim())}
            variant={action === 'approve' ? 'default' : action === 'reject' ? 'destructive' : 'default'}
          >
            {isSubmitting 
              ? 'Processing...' 
              : action === 'approve' 
                ? 'Approve Dataset' 
                : action === 'reject'
                ? 'Reject Dataset'
                : 'Send Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetReviewDialog;
