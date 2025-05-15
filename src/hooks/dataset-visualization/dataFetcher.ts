
import { toast } from 'sonner';
import { Dataset } from '@/types/dataset';
import { getDatasetById } from '@/services/datasetService';
import { getDatasetVisualization } from '@/services/datasetVisualizationService';
import { generateSampleData } from '@/utils/datasetVisualizationUtils';
import { processGeoJSONForDataset } from './geoJSONProcessor';
import { generateInsightsForData } from './insightsProcessor';

export interface FetchDataResult {
  dataset: Dataset | null;
  visualizationData: any[] | null;
  geoJSON: any | null;
  insights: string[];
  error: string | null;
}

/**
 * Fetches dataset and visualization data
 */
export async function fetchDatasetAndVisualization(id: string): Promise<FetchDataResult> {
  try {
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
    
    // Process GeoJSON data
    const geoJSON = await processGeoJSONForDataset(dataset, []);
    
    try {
      // Get visualization data for the dataset
      const visData = await getDatasetVisualization(id);
      
      if (!visData || visData.length === 0) {
        throw new Error("Failed to generate visualization data");
      }
      
      // If we have data but no GeoJSON for electricity datasets, try to create one
      const updatedGeoJSON = !geoJSON && 
        (dataset.category.toLowerCase().includes('electricity') || 
         dataset.category.toLowerCase().includes('power') ||
         dataset.category.toLowerCase().includes('energy')) 
        ? await processGeoJSONForDataset(dataset, visData)
        : geoJSON;
      
      // Generate insights based on the data
      const generatedInsights = generateInsightsForData(visData, dataset.category, dataset.title);

      toast.success("Insights generated from your dataset");
      
      return {
        dataset,
        visualizationData: visData,
        geoJSON: updatedGeoJSON,
        insights: generatedInsights,
        error: null
      };
    } catch (dataError: any) {
      console.error("Error processing dataset:", dataError);
      
      // Fall back to sample data
      const fallbackData = generateSampleData(dataset.category, dataset.title);
      
      // Generate insights based on the fallback data
      const generatedInsights = generateInsightsForData(fallbackData, dataset.category, dataset.title);
      
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
      // Check for GeoJSON data
      const geoJSON = await processGeoJSONForDataset(datasetProp, visualizationDataProp);
      
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
