
import { toast } from 'sonner';

import { getDatasetById } from '@/services/datasetService';
import { getDatasetVisualization } from '@/services/datasetVisualizationService';
import { Dataset } from '@/types/dataset';
import { generateSampleData } from '@/utils/datasetVisualizationUtils';

import { generateInsightsForData } from './insightsProcessor';
import { useGeoJsonStorage } from './useGeoJsonStorage';

export interface FetchDataResult {
  dataset: Dataset | null;
  visualizationData: any[] | null;
  geoJSON: any | null;
  insights: string[];
  error: string | null;
}

/**
 * Optimized function to fetch dataset and visualization data
 */
export async function fetchDatasetAndVisualization(id: string): Promise<FetchDataResult> {
  try {
    // Initialize the storage hook
    const geoJsonStorage = new GeoJsonStorageService();
    
    // Fetch the dataset metadata
    const dataset = await getDatasetById(id);
    
    if (!dataset) {
      return {
        dataset: null,
        visualizationData: null,
        geoJSON: null,
        insights: [],
        error: "Dataset not found"
      };
    }
    
    // Start GeoJSON processing in background
    const geoJsonPromise = geoJsonStorage.processGeoJSONForDataset(dataset, []);
    
    try {
      // Get visualization data for the dataset
      const visData = await getDatasetVisualization(id);
      
      if (!visData || visData.length === 0) {
        throw new Error("Failed to generate visualization data");
      }
      
      // By now, geoJSON might be ready
      let geoJSON = await geoJsonPromise;
      
      // If we have data but no GeoJSON for electricity datasets, try to create one
      if (!geoJSON && 
        (dataset.category.toLowerCase().includes('electricity') || 
         dataset.category.toLowerCase().includes('power') ||
         dataset.category.toLowerCase().includes('energy'))) {
        geoJSON = await geoJsonStorage.processGeoJSONForDataset(dataset, visData);
      }
      
      // Generate insights based on the data
      const generatedInsights = generateInsightsForData(visData, dataset.category, dataset.title);

      toast.success("Insights generated from your dataset");
      
      return {
        dataset,
        visualizationData: visData,
        geoJSON,
        insights: generatedInsights,
        error: null
      };
    } catch (dataError: any) {
      console.error("Error processing dataset:", dataError);
      
      // Fall back to sample data
      const fallbackData = generateSampleData(dataset.category, dataset.title);
      
      // Generate insights based on the fallback data
      const generatedInsights = generateInsightsForData(fallbackData, dataset.category, dataset.title);
      
      // Use the GeoJSON if it was still retrieved successfully
      const geoJSON = await geoJsonPromise.catch(() => null);
      
      toast.info("Using sample data for visualization");
      
      return {
        dataset,
        visualizationData: fallbackData,
        geoJSON,
        insights: generatedInsights,
        error: null
      };
    }
  } catch (error: any) {
    console.error("Error fetching dataset for visualization:", error);
    
    // Provide default data even in case of error
    const defaultData = [
      { name: 'Sample 1', value: 200 },
      { name: 'Sample 2', value: 300 },
      { name: 'Sample 3', value: 400 },
      { name: 'Sample 4', value: 500 },
      { name: 'Sample 5', value: 600 }
    ];
    
    toast.error("Failed to load visualization data");
    
    return {
      dataset: null,
      visualizationData: defaultData,
      geoJSON: null,
      insights: [],
      error: error?.message || "Failed to load visualization data"
    };
  }
}

/**
 * Processes props data without fetching from API
 */
export function processPropsData(
  datasetProp: Dataset,
  visualizationDataProp: any[]
): Promise<FetchDataResult> {
  return new Promise(async (resolve) => {
    try {
      // Initialize the storage hook
      const geoJsonStorage = new GeoJsonStorageService();
      
      // Check for GeoJSON data
      const geoJSON = await geoJsonStorage.processGeoJSONForDataset(datasetProp, visualizationDataProp);
      
      // Generate insights based on provided data
      const generatedInsights = generateInsightsForData(
        visualizationDataProp, 
        datasetProp.category, 
        datasetProp.title
      );
      
      resolve({
        dataset: datasetProp,
        visualizationData: visualizationDataProp,
        geoJSON,
        insights: generatedInsights,
        error: null
      });
    } catch (err: any) {
      console.error("Error processing provided visualization data:", err);
      
      resolve({
        dataset: datasetProp,
        visualizationData: visualizationDataProp,
        geoJSON: null,
        insights: [],
        error: err?.message || "Failed to process data"
      });
    }
  });
}

// Simple service class for GeoJSON storage
class GeoJsonStorageService {
  async processGeoJSONForDataset(dataset: Dataset, visualizationData: any[]): Promise<any | null> {
    try {
      // Check for GeoJSON data
      if (dataset.id) {
        // Try to get from localStorage first (fastest)
        try {
          const storedGeoJSON = localStorage.getItem(`geojson_${dataset.id}`);
          if (storedGeoJSON) {
            console.log("GeoJSON data found in localStorage for dataset:", dataset.id);
            return JSON.parse(storedGeoJSON);
          }
        } catch (e) {
          console.warn("Could not retrieve GeoJSON from localStorage:", e);
        }
        
        // If not in localStorage, try to get it from the service
        const geoData = await getGeoJSONForDataset(dataset.id);
        if (geoData) {
          console.log("GeoJSON data found for dataset:", dataset.id);
          
          // Store it for future use
          try {
            localStorage.setItem(`geojson_${dataset.id}`, JSON.stringify(geoData));
          } catch (e) {
            console.warn("Could not store GeoJSON in localStorage:", e);
          }
          
          return geoData;
        }
        
        // For electricity datasets, try to create a simplified GeoJSON if none exists
        if (dataset.category.toLowerCase().includes('electricity') || 
            dataset.category.toLowerCase().includes('power') ||
            dataset.category.toLowerCase().includes('energy')) {
          
          console.log("Creating simplified GeoJSON for electricity dataset");
          
          // Import dynamically to avoid circular dependencies
          const { createSimplifiedGeoJSON } = await import('./geojsonUtils');
          const simplifiedGeoJSON = createSimplifiedGeoJSON(visualizationData, dataset.category);
          
          if (simplifiedGeoJSON) {
            // Store it for future use
            try {
              localStorage.setItem(`geojson_${dataset.id}`, JSON.stringify(simplifiedGeoJSON));
            } catch (e) {
              console.warn("Could not store simplified GeoJSON in localStorage:", e);
            }
            
            return simplifiedGeoJSON;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error processing GeoJSON data:", error);
      return null;
    }
  }
}

// Helper function to get GeoJSON from the dataset processor
async function getGeoJSONForDataset(datasetId: string): Promise<any | null> {
  try {
    // Dynamic import to avoid circular dependencies
    const { getGeoJSONForDataset: getGeoJSON } = await import('@/services/visualization/datasetProcessor');
    return await getGeoJSON(datasetId);
  } catch (e) {
    console.error("Error retrieving GeoJSON from service:", e);
    return null;
  }
}
