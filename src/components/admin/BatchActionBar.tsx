
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  onBatchApprove: () => void;
  onBatchReject: () => void;
  onClearSelection: () => void;
  isProcessing: boolean;
}

const BatchActionBar = ({ 
  selectedCount, 
  onBatchApprove, 
  onBatchReject, 
  onClearSelection,
  isProcessing
}: BatchActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-4 sticky top-20 z-10 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 text-sm">
            {selectedCount} dataset{selectedCount > 1 ? 's' : ''} selected
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            disabled={isProcessing}
          >
            Clear selection
          </Button>
        </div>
        
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                disabled={selectedCount === 0 || isProcessing}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Reject Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject {selectedCount} Datasets</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject {selectedCount} dataset{selectedCount > 1 ? 's' : ''}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                  onClick={onBatchReject}
                >
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                size="sm"
                disabled={selectedCount === 0 || isProcessing}
                className="gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Approve Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve {selectedCount} Datasets</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve {selectedCount} dataset{selectedCount > 1 ? 's' : ''}?
                  This will make them public on African Data Commons.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onBatchApprove}>
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default BatchActionBar;
