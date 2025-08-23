
import { useState, useEffect, useCallback, useMemo } from 'react';

import { getGeoJSONForDataset, clearGeoJSONForDataset } from '@/services/visualization/storage/geoJsonStorage';
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
  const [isLoadingGeoJSON, setIsLoadingGeoJSON] = useState(false);

  // Function to fetch dataset and visualization data
  const fetchDatasetAndVisualize = useCallback(async () => {
    // Skip fetching if data was passed as prop
    if (datasetProp && visualizationDataProp) {
      try {
        setIsLoading(true);
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
      
      // First check if we already have the GeoJSON in storage 
      setIsLoadingGeoJSON(true);
      const cachedGeoJSON = id ? await getGeoJSONForDataset(id) : null;
      setIsLoadingGeoJSON(false);
      
      // Fetch the dataset and visualization data
      const result = await fetchDatasetAndVisualization(id);
      
      setDataset(result.dataset);
      setVisualizationData(result.visualizationData);
      
      // Use cached GeoJSON if available, otherwise use the fetched one
      if (cachedGeoJSON) {
        console.log("Using cached GeoJSON for dataset:", id);
        setGeoJSON(cachedGeoJSON);
      } else {
        setGeoJSON(result.geoJSON);
      }
      
      setInsights(result.insights);
      setError(result.error);
    } catch (error: any) {
      console.error("Error in useDatasetVisualization:", error);
      setError(error?.message || "Failed to load visualization data");
    } finally {
      setIsLoading(false);
      setIsLoadingGeoJSON(false);
    }
  }, [id, datasetProp, visualizationDataProp]);
  
  // Fetch data on component mount or when dependencies change
  useEffect(() => {
    fetchDatasetAndVisualize();
  }, [fetchDatasetAndVisualize, retryCount]);

  // Handler for retrying data fetch
  const handleRetry = useCallback(async () => {
    // Clear cached GeoJSON to ensure fresh data
    if (id) {
      clearGeoJSONForDataset(id);
    }
    
    setRetryCount(prev => prev + 1);
    return fetchDatasetAndVisualize();
  }, [fetchDatasetAndVisualize, id]);

  // Memoize the result to prevent unnecessary rerenders
  const result = useMemo(() => ({
    dataset,
    visualizationData: visualizationData || [],
    isLoading: isLoading || isLoadingGeoJSON,
    error,
    insights,
    analysisMode,
    setAnalysisMode,
    handleRetry,
    geoJSON,
    isLoadingGeoJSON
  }), [dataset, visualizationData, isLoading, isLoadingGeoJSON, error, insights, analysisMode, handleRetry, geoJSON]);

  return result;
}
