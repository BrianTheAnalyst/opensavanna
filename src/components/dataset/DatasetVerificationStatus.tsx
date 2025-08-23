
import { AlertCircle, Check, X } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dataset } from '@/types/dataset';

interface DatasetVerificationStatusProps {
  dataset: Dataset;
  className?: string;  // Add optional className prop
}

const DatasetVerificationStatus: React.FC<DatasetVerificationStatusProps> = ({ 
  dataset,
  className = '' // Default to empty string
}) => {
  // Check both the TypeScript property and potentially the database column name
  const verificationStatus = dataset.verificationStatus || (dataset as any).verification_status;
  const verificationNotes = dataset.verificationNotes || (dataset as any).verification_notes;

  if (!verificationStatus || verificationStatus === 'pending') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`bg-yellow-100 text-yellow-800 flex items-center gap-1 border-yellow-300 ${className}`}>
              <AlertCircle className="h-3 w-3" />
              <span>Pending Review</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This dataset is waiting for admin review</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (verificationStatus === 'approved') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="success" className={`bg-green-100 text-green-800 flex items-center gap-1 border-green-300 ${className}`}>
              <Check className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This dataset has been reviewed and approved</p>
            {verificationNotes && (
              <p className="text-xs mt-1 italic">{verificationNotes}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
              <X className="h-3 w-3" />
              <span>Rejected</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This dataset was reviewed and rejected</p>
            {verificationNotes && (
              <p className="text-xs mt-1 italic">{verificationNotes}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
};

export default DatasetVerificationStatus;
