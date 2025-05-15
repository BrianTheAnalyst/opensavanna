
import React from 'react';
import NoVisualizationData from '@/components/visualization/NoVisualizationData';

interface DatasetVisualizeErrorProps {
  error: string | null;
  onRetry: () => Promise<void>;
}

const DatasetVisualizeError: React.FC<DatasetVisualizeErrorProps> = ({ error, onRetry }) => {
  return (
    <NoVisualizationData 
      onRetry={onRetry} 
      error={error || "No visualization data available"} 
    />
  );
};

export default DatasetVisualizeError;
