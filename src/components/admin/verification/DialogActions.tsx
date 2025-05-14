
import React from 'react';
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  action: 'approve' | 'reject' | 'feedback';
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  action,
  isSubmitting,
  onCancel,
  onSubmit,
  isDisabled
}) => {
  const getActionButtonText = () => {
    if (isSubmitting) {
      return 'Processing...';
    }
    
    switch (action) {
      case 'approve': return 'Approve Dataset';
      case 'reject': return 'Reject Dataset';
      case 'feedback': return 'Send Feedback';
    }
  };
  
  const getActionButtonVariant = () => {
    switch (action) {
      case 'approve': return 'default';
      case 'reject': return 'destructive';
      case 'feedback': return 'default';
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || isDisabled}
        variant={getActionButtonVariant() as "default" | "destructive"}
      >
        {getActionButtonText()}
      </Button>
    </>
  );
};

export default DialogActions;
