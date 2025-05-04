
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from './StatusBadge';

interface DatasetHeaderProps {
  id: string;
  title: string;
  verificationStatus?: string;
  isSelected: boolean;
  onSelect: (datasetId: string, checked: boolean) => void;
}

const DatasetHeader = ({ id, title, verificationStatus = 'pending', isSelected, onSelect }: DatasetHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <Checkbox 
        id={`select-dataset-${id}`}
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(id, !!checked)}
        aria-label={`Select ${title} for batch processing`}
      />
      <h3 className="text-lg font-medium">{title}</h3>
      <StatusBadge status={verificationStatus} />
    </div>
  );
};

export default DatasetHeader;
