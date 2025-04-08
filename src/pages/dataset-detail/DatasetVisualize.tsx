
import { useParams } from 'react-router-dom';
import { Dataset } from '@/types/dataset';
import LoadingVisualization from '@/components/visualization/LoadingVisualization';
import NoVisualizationData from '@/components/visualization/NoVisualizationData';
import VisualizationContainer from '@/components/visualization/VisualizationContainer';
import VisualizationAbout from '@/components/visualization/VisualizationAbout';
import { useDatasetVisualization } from '@/hooks/useDatasetVisualization';

interface DatasetVisualizeProps {
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

const DatasetVisualize: React.FC<DatasetVisualizeProps> = ({ datasetProp, visualizationDataProp }) => {
  const { id } = useParams();
  
  const {
    dataset,
    visualizationData,
    isLoading,
    error,
    insights,
    analysisMode,
    setAnalysisMode,
    handleRetry
  } = useDatasetVisualization({
    id,
    datasetProp,
    visualizationDataProp
  });
  
  if (isLoading) {
    return <LoadingVisualization />;
  }
  
  if (!visualizationData || !dataset) {
    return <NoVisualizationData onRetry={handleRetry} error={error || undefined} />;
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
      />
      
      <VisualizationAbout dataset={dataset} />
    </>
  );
};

export default DatasetVisualize;
