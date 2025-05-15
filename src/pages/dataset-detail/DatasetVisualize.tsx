
import { useParams } from 'react-router-dom';
import { Dataset } from '@/types/dataset';
import LoadingVisualization from '@/components/visualization/LoadingVisualization';
import { useDatasetVisualization } from '@/hooks/useDatasetVisualization';
import { useDatasetDetail } from '@/hooks/useDatasetDetail';
import { useEffect } from 'react';
import { toast } from "sonner";
import DatasetVisualizeContent from './components/DatasetVisualizeContent';
import DatasetVisualizeError from './components/DatasetVisualizeError';

interface DatasetVisualizeProps {
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

const DatasetVisualize = ({ datasetProp, visualizationDataProp }: DatasetVisualizeProps) => {
  const { id } = useParams();
  
  const {
    dataset,
    processedFileData,
    isLoadingProcessedData
  } = useDatasetDetail({
    id,
    datasetProp
  });
  
  const {
    visualizationData,
    isLoading,
    error,
    insights,
    analysisMode,
    setAnalysisMode,
    handleRetry,
    geoJSON
  } = useDatasetVisualization({
    id,
    datasetProp,
    visualizationDataProp
  });
  
  // Handle errors during data fetch
  useEffect(() => {
    if (error) {
      toast.error(`Error loading visualization: ${error}`);
    }
  }, [error]);
  
  // Show loading state
  if (isLoading) {
    return <LoadingVisualization />;
  }
  
  // Show error if no dataset found
  if (!dataset) {
    return <DatasetVisualizeError onRetry={handleRetry} error="Dataset not found" />;
  }

  // Show error if no visualization data
  if (!visualizationData || visualizationData.length === 0) {
    return <DatasetVisualizeError onRetry={handleRetry} error={error} />;
  }
  
  // Show visualization content
  return (
    <DatasetVisualizeContent
      dataset={dataset}
      visualizationData={visualizationData}
      insights={insights}
      analysisMode={analysisMode}
      setAnalysisMode={setAnalysisMode}
      processedFileData={processedFileData}
      isLoadingProcessedData={isLoadingProcessedData}
      error={error}
      geoJSON={geoJSON}
    />
  );
};

export default DatasetVisualize;
