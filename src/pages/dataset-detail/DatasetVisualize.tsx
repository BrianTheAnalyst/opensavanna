
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Dataset } from '@/types/dataset';
import LoadingVisualization from '@/components/visualization/LoadingVisualization';
import NoVisualizationData from '@/components/visualization/NoVisualizationData';
import VisualizationContainer from '@/components/visualization/VisualizationContainer';
import VisualizationAbout from '@/components/visualization/VisualizationAbout';
import { useDatasetVisualization } from '@/hooks/useDatasetVisualization';
import DatasetAnalytics from '@/components/DatasetAnalytics';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DatasetVisualizeProps {
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

const DatasetVisualize = ({ datasetProp, visualizationDataProp }: DatasetVisualizeProps) => {
  const { id } = useParams();
  const [processedFileData, setProcessedFileData] = useState<any>(null);
  const [isLoadingProcessedData, setIsLoadingProcessedData] = useState(false);
  
  const {
    dataset,
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
  
  // Fetch processed file data when dataset is loaded
  const fetchProcessedFileData = useCallback(async () => {
    if (!dataset?.id) return;
    
    try {
      setIsLoadingProcessedData(true);
      const { data, error } = await supabase
        .from('processed_files')
        .select('*')
        .eq('storage_path', `${dataset.id}/%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Error fetching processed file data:', error);
        return;
      }
        
      if (data && data.length > 0) {
        setProcessedFileData(data[0]);
      }
    } catch (err) {
      console.error('Error fetching processed file data:', err);
    } finally {
      setIsLoadingProcessedData(false);
    }
  }, [dataset?.id]);
  
  useEffect(() => {
    fetchProcessedFileData();
  }, [fetchProcessedFileData]);

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
      
      {isLoadingProcessedData ? (
        <div className="my-6 p-8 border border-border/50 rounded-xl bg-background/50 animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
          <div className="h-4 w-full bg-muted rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-muted rounded"></div>
        </div>
      ) : processedFileData ? (
        <div className="my-6">
          <DatasetAnalytics processedFileData={processedFileData} />
        </div>
      ) : null}
      
      <VisualizationAbout dataset={dataset} />
    </>
  );
};

export default DatasetVisualize;
