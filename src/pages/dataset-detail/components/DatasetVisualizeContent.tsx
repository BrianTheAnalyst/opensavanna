
import React from 'react';

import DatasetAnalyticsSection from '@/components/dataset/DatasetAnalyticsSection';
import VisualizationAbout from '@/components/visualization/VisualizationAbout';
import VisualizationContainer from '@/components/visualization/VisualizationContainer';
import { Dataset } from '@/types/dataset';

interface DatasetVisualizeContentProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  processedFileData: any[];
  isLoadingProcessedData: boolean;
  error: string | null;
  geoJSON: any | null;
}

const DatasetVisualizeContent: React.FC<DatasetVisualizeContentProps> = ({
  dataset,
  visualizationData,
  insights,
  analysisMode,
  setAnalysisMode,
  processedFileData,
  isLoadingProcessedData,
  error,
  geoJSON
}) => {
  // Make sure we always have an array of data objects with at least name and value properties
  const processedData = Array.isArray(visualizationData) && visualizationData.length > 0
    ? visualizationData
    : [{ name: 'No Data', value: 0 }];
  
  return (
    <>
      <VisualizationContainer 
        dataset={dataset}
        visualizationData={processedData}
        insights={insights}
        analysisMode={analysisMode}
        setAnalysisMode={setAnalysisMode}
        error={error || undefined}
        isLoading={false}
        geoJSON={geoJSON}
      />
      
      <DatasetAnalyticsSection
        processedFileData={processedFileData}
        isLoading={isLoadingProcessedData}
      />
      
      <VisualizationAbout dataset={dataset} />
    </>
  );
};

export default DatasetVisualizeContent;
