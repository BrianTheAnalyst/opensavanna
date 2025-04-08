
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Dataset } from '@/types/dataset';
import { getDatasetById, getDatasetVisualization } from '@/services/datasetService';
import { generateSampleData, generateInsights } from '@/utils/datasetVisualizationUtils';

interface UseDatasetVisualizationProps {
  id?: string;
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

export function useDatasetVisualization({
  id,
  datasetProp,
  visualizationDataProp
}: UseDatasetVisualizationProps) {
  const [dataset, setDataset] = useState<Dataset | null>(datasetProp || null);
  const [visualizationData, setVisualizationData] = useState<any[] | null>(visualizationDataProp || null);
  const [isLoading, setIsLoading] = useState(!datasetProp);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'detailed' | 'advanced'>('overview');

  const fetchDatasetAndVisualize = useCallback(async () => {
    // Skip fetching if data was passed as prop
    if (datasetProp && visualizationDataProp) {
      try {
        // Still generate insights based on provided data
        const generatedInsights = generateInsights(visualizationDataProp, datasetProp.category, datasetProp.title);
        setInsights(generatedInsights);
        setIsLoading(false);
        return;
      } catch (err: any) {
        console.error("Error processing provided visualization data:", err);
        // Continue with normal flow if there was an error
      }
    }

    if (!id) {
      setError("Dataset ID is missing");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch the dataset metadata
      const datasetData = await getDatasetById(id);
      
      if (!datasetData) {
        throw new Error("Dataset not found");
      }
      
      setDataset(datasetData);
      
      try {
        // Get visualization data for the dataset
        const visData = await getDatasetVisualization(id);
        
        if (!visData || visData.length === 0) {
          throw new Error("Failed to generate visualization data");
        }
        
        setVisualizationData(visData);
        
        // Generate insights based on the data
        const generatedInsights = generateInsights(visData, datasetData.category, datasetData.title);
        setInsights(generatedInsights);

        toast.success("Insights generated from your dataset");
      } catch (dataError: any) {
        console.error("Error processing dataset:", dataError);
        
        // Fall back to sample data
        const fallbackData = generateSampleData(datasetData.category, datasetData.title);
        setVisualizationData(fallbackData);
        
        // Generate insights based on the fallback data
        const generatedInsights = generateInsights(fallbackData, datasetData.category, datasetData.title);
        setInsights(generatedInsights);
        
        toast.info("Using sample data for visualization");
      }
    } catch (error: any) {
      console.error("Error fetching dataset for visualization:", error);
      setError(error?.message || "Failed to load visualization data");
      toast.error("Failed to load visualization data");
      
      // Provide default data even in case of error
      const defaultData = [
        { name: 'Sample 1', value: 200 },
        { name: 'Sample 2', value: 300 },
        { name: 'Sample 3', value: 400 },
        { name: 'Sample 4', value: 500 },
        { name: 'Sample 5', value: 600 }
      ];
      setVisualizationData(defaultData);
    } finally {
      setIsLoading(false);
    }
  }, [id, datasetProp, visualizationDataProp]);
  
  useEffect(() => {
    fetchDatasetAndVisualize();
  }, [fetchDatasetAndVisualize]);

  return {
    dataset,
    visualizationData: visualizationData || [],
    isLoading,
    error,
    insights,
    analysisMode,
    setAnalysisMode,
    handleRetry: fetchDatasetAndVisualize
  };
}
