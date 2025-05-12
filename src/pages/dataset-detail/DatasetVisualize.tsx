
import { useParams } from 'react-router-dom';
import { Dataset } from '@/types/dataset';
import LoadingVisualization from '@/components/visualization/LoadingVisualization';
import NoVisualizationData from '@/components/visualization/NoVisualizationData';
import VisualizationContainer from '@/components/visualization/VisualizationContainer';
import VisualizationAbout from '@/components/visualization/VisualizationAbout';
import { useDatasetVisualization } from '@/hooks/useDatasetVisualization';
import { useDatasetDetail } from '@/hooks/useDatasetDetail';
import DatasetAnalyticsSection from '@/components/dataset/DatasetAnalyticsSection';
import { useEffect } from 'react';
import { toast } from "sonner";

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
  
  if (isLoading) {
    return <LoadingVisualization />;
  }
  
  if (!dataset) {
    return <NoVisualizationData onRetry={handleRetry} error="Dataset not found" />;
  }

  if (!visualizationData || visualizationData.length === 0) {
    return <NoVisualizationData onRetry={handleRetry} error={error || "No visualization data available"} />;
  }

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

export default DatasetVisualize;
