
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Dataset } from '@/types/dataset';
import { getDatasetById } from '@/services/datasetService';
import { getDatasetVisualization } from '@/services/datasetVisualizationService';
import { generateSampleData, generateInsights } from '@/utils/datasetVisualizationUtils';
import { getGeoJSONForDataset } from '@/services/visualization/datasetProcessor';

interface UseDatasetVisualizationProps {
  id?: string;
  datasetProp?: Dataset;
  visualizationDataProp?: any[];
}

interface UseDatasetVisualizationResult {
  dataset: Dataset | null;
  visualizationData: any[];
  isLoading: boolean;
  error: string | null;
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  handleRetry: () => Promise<void>;
  geoJSON: any | null;
}

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

  // Function to generate insights memoized to prevent unnecessary recalculations
  const generateInsightsForData = useCallback((data: any[], category: string, title: string) => {
    try {
      return generateInsights(data, category, title);
    } catch (err) {
      console.error("Error generating insights:", err);
      return ["Unable to generate insights for this dataset."];
    }
  }, []);

  const fetchDatasetAndVisualize = useCallback(async () => {
    // Skip fetching if data was passed as prop
    if (datasetProp && visualizationDataProp) {
      try {
        // Check for GeoJSON data
        if (datasetProp.id) {
          const geoData = await getGeoJSONForDataset(datasetProp.id);
          if (geoData) {
            console.log("GeoJSON data found for dataset:", datasetProp.id);
            setGeoJSON(geoData);
          } else {
            // For electricity datasets, try to create a simplified GeoJSON if none exists
            if (datasetProp.category.toLowerCase().includes('electricity') || 
                datasetProp.category.toLowerCase().includes('power') ||
                datasetProp.category.toLowerCase().includes('energy')) {
              
              console.log("Creating simplified GeoJSON for electricity dataset");
              const simplifiedGeoJSON = createSimplifiedGeoJSON(visualizationDataProp, datasetProp.category);
              if (simplifiedGeoJSON) {
                setGeoJSON(simplifiedGeoJSON);
                
                // Store it for future use
                try {
                  localStorage.setItem(`geojson_${datasetProp.id}`, JSON.stringify(simplifiedGeoJSON));
                } catch (e) {
                  console.warn("Could not store simplified GeoJSON in localStorage:", e);
                }
              }
            }
          }
        }
        
        // Generate insights based on provided data
        const generatedInsights = generateInsightsForData(
          visualizationDataProp, 
          datasetProp.category, 
          datasetProp.title
        );
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
      
      // Check for GeoJSON data
      const geoData = await getGeoJSONForDataset(id);
      if (geoData) {
        console.log("GeoJSON data found for dataset:", id);
        setGeoJSON(geoData);
      }
      
      try {
        // Get visualization data for the dataset
        const visData = await getDatasetVisualization(id);
        
        if (!visData || visData.length === 0) {
          throw new Error("Failed to generate visualization data");
        }
        
        setVisualizationData(visData);
        
        // If we have data but no GeoJSON for electricity datasets, try to create one
        if (!geoData && 
            (datasetData.category.toLowerCase().includes('electricity') || 
             datasetData.category.toLowerCase().includes('power') ||
             datasetData.category.toLowerCase().includes('energy'))) {
          
          console.log("Creating simplified GeoJSON for electricity dataset");
          const simplifiedGeoJSON = createSimplifiedGeoJSON(visData, datasetData.category);
          if (simplifiedGeoJSON) {
            setGeoJSON(simplifiedGeoJSON);
            
            // Store it for future use
            try {
              localStorage.setItem(`geojson_${id}`, JSON.stringify(simplifiedGeoJSON));
            } catch (e) {
              console.warn("Could not store simplified GeoJSON in localStorage:", e);
            }
          }
        }
        
        // Generate insights based on the data
        const generatedInsights = generateInsightsForData(visData, datasetData.category, datasetData.title);
        setInsights(generatedInsights);

        toast.success("Insights generated from your dataset");
      } catch (dataError: any) {
        console.error("Error processing dataset:", dataError);
        
        // Fall back to sample data
        const fallbackData = generateSampleData(datasetData.category, datasetData.title);
        setVisualizationData(fallbackData);
        
        // Generate insights based on the fallback data
        const generatedInsights = generateInsightsForData(fallbackData, datasetData.category, datasetData.title);
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
  }, [id, datasetProp, visualizationDataProp, generateInsightsForData]);
  
  // Create a simplified GeoJSON for datasets that don't have proper GeoJSON
  const createSimplifiedGeoJSON = (data: any[], category: string) => {
    if (!data || data.length === 0) return null;
    
    // Look for location data in the dataset
    const hasLocationData = data.some(item => 
      (item.country || item.region || item.city || item.location) && 
      (typeof item.value === 'number' || typeof item.consumption === 'number' || 
       typeof item.electricity === 'number' || typeof item.power === 'number')
    );
    
    if (!hasLocationData) return null;
    
    // Create a simplified GeoJSON structure
    const features = data.map(item => {
      // Find a value to use
      const value = item.value || item.consumption || item.electricity || item.power || 1;
      
      // Find a location to use
      const location = item.country || item.region || item.city || item.location || 'Unknown';
      
      return {
        type: "Feature",
        properties: {
          name: location,
          value: value,
          ...item // Include all original properties
        },
        geometry: {
          type: "Point",
          coordinates: [
            // Use dummy coordinates since we don't have real ones
            // These will be displayed in a non-geographic representation
            Math.random() * 360 - 180, // -180 to 180 longitude
            Math.random() * 170 - 85   // -85 to 85 latitude (avoid poles)
          ]
        }
      };
    });
    
    return {
      type: "FeatureCollection",
      features: features,
      metadata: {
        category: category,
        numericFields: {
          value: {
            min: Math.min(...features.map(f => f.properties.value)),
            max: Math.max(...features.map(f => f.properties.value))
          }
        }
      }
    };
  };
  
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
  }), [dataset, visualizationData, isLoading, error, insights, analysisMode, setAnalysisMode, handleRetry, geoJSON]);

  return result;
}
