
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dataset } from '@/types/dataset';
import LoadingVisualization from '@/components/visualization/LoadingVisualization';
import NoVisualizationData from '@/components/visualization/NoVisualizationData';
import VisualizationContainer from '@/components/visualization/VisualizationContainer';
import VisualizationAbout from '@/components/visualization/VisualizationAbout';
import { useDatasetVisualization } from '@/hooks/useDatasetVisualization';
import DatasetAnalytics from '@/components/DatasetAnalytics';
import { supabase } from "@/integrations/supabase/client";

interface DatasetVisualizeProps {
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

const DatasetVisualize = ({ datasetProp, visualizationDataProp }: DatasetVisualizeProps) => {
  const { id } = useParams();
  const [processedFileData, setProcessedFileData] = useState<any>(null);
  
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
  
  // Fetch processed file data when dataset is loaded
  useEffect(() => {
    const fetchProcessedFileData = async () => {
      if (!dataset?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('processed_files')
          .select('*')
          .eq('storage_path', `${dataset.id}/%`)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!error && data && data.length > 0) {
          setProcessedFileData(data[0]);
        }
      } catch (err) {
        console.error('Error fetching processed file data:', err);
      }
    };
    
    fetchProcessedFileData();
  }, [dataset?.id]);
  
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
      
      {processedFileData && (
        <div className="my-6">
          <DatasetAnalytics processedFileData={processedFileData} />
        </div>
      )}
      
      <VisualizationAbout dataset={dataset} />
    </>
  );
};

export default DatasetVisualize;
