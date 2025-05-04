
import React from 'react';
import { Card } from "@/components/ui/card";
import { DatasetWithEmail } from '@/types/dataset';
import DatasetHeader from './verification/DatasetHeader';
import DatasetMetadata from './verification/DatasetMetadata';
import DatasetActions from './verification/DatasetActions';

interface DatasetVerificationCardProps {
  dataset: DatasetWithEmail;
  onReview: (dataset: DatasetWithEmail) => void;
  isSelected: boolean;
  onSelect: (datasetId: string, checked: boolean) => void;
}

const DatasetVerificationCard = ({ dataset, onReview, isSelected, onSelect }: DatasetVerificationCardProps) => {
  return (
    <Card key={dataset.id} className="p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <DatasetHeader 
            id={dataset.id}
            title={dataset.title}
            verificationStatus={dataset.verificationStatus}
            isSelected={isSelected}
            onSelect={onSelect}
          />
          <p className="text-sm text-foreground/70 mt-1 mb-2">{dataset.description}</p>
          
          <DatasetMetadata dataset={dataset} />
        </div>
        
        <DatasetActions dataset={dataset} onReview={onReview} />
      </div>
    </Card>
  );
};

// Export the StatusBadge for direct use elsewhere
export { default as StatusBadge } from './verification/StatusBadge';

export default DatasetVerificationCard;
