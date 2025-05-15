
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dataset } from '@/types/dataset';
import { fetchDatasetAndVisualization, processPropsData } from './dataFetcher';
import { UseDatasetVisualizationProps, UseDatasetVisualizationResult } from './types';

export function useDatasetVisualization({
  id,
  datasetProp,
  visualizationDataProp
}: UseDatasetVisualizationProps): UseDatasetVisualizationResult {
  const [dataset, setDataset] = useState<Dataset | null>(datasetProp || null);
  const [visualizationData, setVisualizationData] = useState<any[] | null>(visualizationDataProp || null);
  const [isLoading, setIsLoading] = useState(!datasetProp);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'detailed' | 'advanced'>('overview');
  const [retryCount, setRetryCount] = useState(0);
  const [geoJSON, setGeoJSON] = useState<any | null>(null);

  const fetchDatasetAndVisualize = useCallback(async () => {
    // Skip fetching if data was passed as prop
    if (datasetProp && visualizationDataProp) {
      try {
        const result = await processPropsData(datasetProp, visualizationDataProp);
        setGeoJSON(result.geoJSON);
        setInsights(result.insights);
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
      
      const result = await fetchDatasetAndVisualization(id);
      
      setDataset(result.dataset);
      setVisualizationData(result.visualizationData);
      setGeoJSON(result.geoJSON);
      setInsights(result.insights);
      setError(result.error);
    } catch (error: any) {
      console.error("Error in useDatasetVisualization:", error);
      setError(error?.message || "Failed to load visualization data");
    } finally {
      setIsLoading(false);
    }
  }, [id, datasetProp, visualizationDataProp]);
  
  useEffect(() => {
    fetchDatasetAndVisualize();
  }, [fetchDatasetAndVisualize, retryCount]);

  // Handler for retrying data fetch
  const handleRetry = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    return fetchDatasetAndVisualize();
  }, [fetchDatasetAndVisualize]);

  // Memoize the result to prevent unnecessary rerenders
  const result = useMemo(() => ({
    dataset,
    visualizationData: visualizationData || [],
    isLoading,
    error,
    insights,
    analysisMode,
    setAnalysisMode,
    handleRetry,
    geoJSON
  }), [dataset, visualizationData, isLoading, error, insights, analysisMode, handleRetry, geoJSON]);

  return result;
}
