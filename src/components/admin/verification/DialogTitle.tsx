
import { Check, X, MessageSquare } from "lucide-react";
import React from 'react';

interface DialogTitleProps {
  action: 'approve' | 'reject' | 'feedback';
}

const DialogTitle: React.FC<DialogTitleProps> = ({ action }) => {
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

export default DialogTitle;
