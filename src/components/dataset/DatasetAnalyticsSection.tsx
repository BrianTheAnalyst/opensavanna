
import React from 'react';

import DatasetAnalytics from '@/components/DatasetAnalytics';

interface DatasetAnalyticsSectionProps {
  processedFileData: any;
  isLoading: boolean;
}

const DatasetAnalyticsSection: React.FC<DatasetAnalyticsSectionProps> = ({
  processedFileData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="my-6 p-8 border border-border/50 rounded-xl bg-background/50 animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
        <div className="h-4 w-full bg-muted rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </div>
    );
  }
  
  if (!processedFileData) {
    return null;
  }
  
  return (
    <div className="my-6">
      <DatasetAnalytics processedFileData={processedFileData} />
    </div>
  );
};

export default DatasetAnalyticsSection;
