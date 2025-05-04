
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { Dataset } from '@/types/dataset';

interface DatasetActionsProps {
  dataset: Dataset;
  onReview: (dataset: Dataset) => void;
}

const DatasetActions = ({ dataset, onReview }: DatasetActionsProps) => {
  return (
    <div className="flex flex-col gap-2 justify-center items-start md:items-end">
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => onReview(dataset)}
      >
        Review Dataset
      </Button>
      
      {dataset.file && (
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => window.open(dataset.file, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View File
        </Button>
      )}
    </div>
  );
};

export default DatasetActions;
