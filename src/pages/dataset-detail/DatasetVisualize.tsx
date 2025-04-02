
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dataset } from '@/types/dataset';
import { toast } from 'sonner';
import LoadingVisualization from '@/components/visualization/LoadingVisualization';
import NoVisualizationData from '@/components/visualization/NoVisualizationData';
import VisualizationContainer from '@/components/visualization/VisualizationContainer';
import VisualizationAbout from '@/components/visualization/VisualizationAbout';
import { 
  generateSampleData, 
  generateInsights 
} from '@/utils/datasetVisualizationUtils';

const DatasetVisualize = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [visualizationData, setVisualizationData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'detailed' | 'advanced'>('overview');

  const fetchDatasetAndVisualize = useCallback(async () => {
    if (!id) {
      setError("Dataset ID is missing");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the dataset metadata
      const { data: datasetData, error: datasetError } = await supabase
        .from('datasets')
        .select('*')
        .eq('id', id)
        .single();
        
      if (datasetError) {
        throw new Error(datasetError.message);
      }
      
      setDataset(datasetData);
      
      // Attempt to fetch the actual data if a file exists
      if (datasetData.file) {
        // For demonstration, we'll use sample data based on the dataset category
        // In a real implementation, you would fetch and parse the actual file
        const sampleData = generateSampleData(datasetData.category, datasetData.title);
        
        if (!sampleData || sampleData.length === 0) {
          throw new Error("Failed to generate visualization data");
        }
        
        setVisualizationData(sampleData);
        
        // Generate insights based on the data
        const generatedInsights = generateInsights(sampleData, datasetData.category, datasetData.title);
        setInsights(generatedInsights);

        toast.success("Insights generated from your dataset");
      } else {
        // If no file exists, use fallback data based on category
        const fallbackData = generateSampleData(datasetData.category, datasetData.title);
        
        if (!fallbackData || fallbackData.length === 0) {
          throw new Error("Failed to generate fallback visualization data");
        }
        
        setVisualizationData(fallbackData);
        
        // Generate insights based on the fallback data
        const generatedInsights = generateInsights(fallbackData, datasetData.category, datasetData.title);
        setInsights(generatedInsights);
        
        toast.info("Using sample data for visualization as the actual dataset file couldn't be processed");
      }
    } catch (error: any) {
      console.error("Error fetching dataset for visualization:", error);
      setError(error?.message || "Failed to load visualization data");
      toast.error("Failed to load visualization data");
      setVisualizationData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchDatasetAndVisualize();
  }, [fetchDatasetAndVisualize]);
  
  const handleRetry = () => {
    toast.info("Retrying visualization generation...");
    fetchDatasetAndVisualize();
  };
  
  if (isLoading) {
    return <LoadingVisualization />;
  }
  
  if (!visualizationData || !dataset) {
    return <NoVisualizationData onRetry={handleRetry} error={error || undefined} />;
  }
  
  return (
    <>
      <VisualizationContainer 
        dataset={dataset}
        visualizationData={visualizationData}
        insights={insights}
        analysisMode={analysisMode}
        setAnalysisMode={setAnalysisMode}
        error={error || undefined}
      />
      
      <VisualizationAbout dataset={dataset} />
    </>
  );
};

export default DatasetVisualize;
