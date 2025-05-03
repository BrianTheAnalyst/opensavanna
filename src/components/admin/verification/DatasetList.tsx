
import React from 'react';
import DatasetVerificationCard from '@/components/admin/DatasetVerificationCard';
import EmptyDatasetState from '@/components/admin/EmptyDatasetState';
import LoadingSpinner from './LoadingSpinner';
import { DatasetWithEmail } from '@/types/dataset';

interface DatasetListProps {
  datasets: DatasetWithEmail[];
  isLoading: boolean;
  activeTab: string;
  selectedIds: Set<string>;
  onReview: (dataset: DatasetWithEmail) => void;
  onSelect: (datasetId: string, checked: boolean) => void;
}

const DatasetList = ({ 
  datasets, 
  isLoading, 
  activeTab, 
  selectedIds, 
  onReview, 
  onSelect 
}: DatasetListProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (datasets.length === 0) {
    return <EmptyDatasetState activeTab={activeTab} />;
  }

  return (
    <div className="space-y-4">
      {datasets.map((dataset) => (
        <DatasetVerificationCard 
          key={dataset.id} 
          dataset={dataset} 
          onReview={onReview}
          isSelected={selectedIds.has(dataset.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default DatasetList;
