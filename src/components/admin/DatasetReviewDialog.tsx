
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { Dataset } from '@/types/dataset';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DatasetWithEmail extends Dataset {
  email?: string;
}

interface DatasetReviewDialogProps {
  dataset: DatasetWithEmail | null;
  onClose: () => void;
  onProcessed: (datasetId: string) => void;
}

export const DatasetReviewDialog = ({ dataset, onClose, onProcessed }: DatasetReviewDialogProps) => {
  const [feedbackNote, setFeedbackNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (dataset) {
      setFeedbackNote(dataset.verificationNotes || '');
    }
  }, [dataset]);

  // Process verification action
  const processVerification = async (action: 'approve' | 'reject') => {
    if (!dataset) return;
    
    setIsProcessing(true);
    
    try {
      // Update dataset verification status
      const updateData = {
        verificationStatus: action === 'approve' ? 'approved' : 'rejected',
        verified: action === 'approve',
        verificationNotes: feedbackNote || null,
        verifiedAt: action === 'approve' ? new Date().toISOString() : null
      };
      
      // Fixed: Use correct typing that matches the Supabase database schema
      const { error } = await supabase
        .from('datasets')
        .update({
          // These fields need to be added to the database schema
          verificationStatus: updateData.verificationStatus,
          verified: updateData.verified,
          verificationNotes: updateData.verificationNotes,
          verifiedAt: updateData.verifiedAt
        })
        .eq('id', dataset.id);
      
      if (error) throw error;
      
      toast.success(`Dataset ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      onProcessed(dataset.id);
      
    } catch (error) {
      console.error(`Error ${action}ing dataset:`, error);
      toast.error(`Failed to ${action} dataset`);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  // Preview data component
  const DataPreview = ({ dataset }: { dataset: DatasetWithEmail }) => {
    const [preview, setPreview] = useState<string>('Loading preview...');
    
    useEffect(() => {
      const loadPreview = async () => {
        if (dataset.file) {
          try {
            const response = await fetch(dataset.file);
            const text = await response.text();
            // Show first 500 chars as preview
            setPreview(text.slice(0, 500) + (text.length > 500 ? '...' : ''));
          } catch (error) {
            setPreview('Unable to load file preview');
          }
        } else {
          setPreview('No file available');
        }
      };
      
      loadPreview();
    }, [dataset.file]);
    
    return (
      <div className="border rounded-md p-3 bg-muted/30 overflow-x-auto">
        <pre className="text-xs font-mono whitespace-pre-wrap">{preview}</pre>
      </div>
    );
  };

  if (!dataset) return null;

  return (
    <Dialog open={!!dataset} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Dataset: {dataset.title}</DialogTitle>
          <DialogDescription>
            Verify this dataset complies with African data protection laws and quality standards
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Dataset Details</h4>
            <div className="glass border border-border/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground/50">Description</p>
                  <p className="text-sm">{dataset.description}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/50">Source</p>
                  <p className="text-sm">{dataset.source || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Data Preview</h4>
            <DataPreview dataset={dataset} />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Verification Notes</h4>
            <Textarea 
              placeholder="Add notes about this dataset (compliance, quality, follow-up needed, etc.)"
              value={feedbackNote}
              onChange={e => setFeedbackNote(e.target.value)}
              rows={4}
            />
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Verify this dataset meets quality standards and complies with African data protection laws before approval.
            </AlertDescription>
          </Alert>
        </div>
        
        <Separator />
        
        <DialogFooter>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => processVerification('reject')}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Reject Dataset'}
              </Button>
              
              <Button 
                variant="default"
                onClick={() => processVerification('approve')} 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Approve Dataset'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetReviewDialog;
