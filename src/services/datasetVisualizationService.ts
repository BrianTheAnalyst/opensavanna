
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";
import { parseCSVData, formatJSONForVisualization, formatGeoJSONForVisualization } from "@/utils/dataFormatUtils";

// Get dataset visualization data
export const getDatasetVisualization = async (id: string): Promise<any> => {
  try {
    // First, get the dataset to check the category and format
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching dataset:', fetchError);
      toast.error('Failed to load dataset');
      return [];
    }
    
    if (!dataset) {
      toast.error('Dataset not found');
      return [];
    }

    // Try to get processed data first
    const processedData = await getProcessedDataForDataset(dataset);
    if (processedData.length > 0) {
      return processedData;
    }
    
    // If no processed data, try to parse from file
    if (dataset.file) {
      return await parseDataFromFile(dataset);
    }
    
    // No file available
    return [];
  } catch (error) {
    console.error('Error fetching visualization data:', error);
    // Return empty dataset on error
    return [];
  }
};

// Get processed data for a dataset
const getProcessedDataForDataset = async (dataset: Dataset): Promise<any[]> => {
  try {
    // Check if we have processed data for this dataset
    const { data: processedFiles, error: processedError } = await supabase
      .from('processed_files')
      .select('*')
      .eq('storage_path', `${dataset.id}/%`)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!processedError && processedFiles && processedFiles.length > 0) {
      const processedFile = processedFiles[0];
      
      // If we have a summary with the processed file, use that to generate visualization data
      if (processedFile.summary) {
        const visualizationData = generateVisualizationDataFromSummary(processedFile.summary, dataset.category);
        if (visualizationData.length > 0) {
          return visualizationData;
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error getting processed data:', error);
    return [];
  }
};

// Parse data from file URL
const parseDataFromFile = async (dataset: Dataset): Promise<any[]> => {
  try {
    const response = await fetch(dataset.file as string);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    // Handle different file formats
    if (dataset.format.toLowerCase() === 'csv') {
      const text = await response.text();
      return parseCSVData(text, dataset.category);
    } else if (dataset.format.toLowerCase() === 'json') {
      const json = await response.json();
      return formatJSONForVisualization(json, dataset.category);
    } else if (dataset.format.toLowerCase() === 'geojson') {
      const json = await response.json();
      return formatGeoJSONForVisualization(json, dataset.category);
    } else {
      console.log('Unsupported format');
      return [];
    }
  } catch (error) {
    console.error('Error processing dataset file:', error);
    return [];
  }
};

// Generate visualization data from processed file summary
const generateVisualizationDataFromSummary = (summary: any, category: string): any[] => {
  const result = [];
  
  // For numeric fields, create data points showing distribution
  if (summary.numeric_fields) {
    Object.entries(summary.numeric_fields).forEach(([field, stats]: [string, any]) => {
      result.push({
        name: `${field} (min)`,
        value: stats.min
      });
      result.push({
        name: `${field} (max)`,
        value: stats.max
      });
      result.push({
        name: `${field} (avg)`,
        value: stats.mean
      });
    });
  }
  
  // For categorical fields with distribution data, use that
  if (summary.categorical_fields) {
    Object.entries(summary.categorical_fields).forEach(([field, fieldInfo]: [string, any]) => {
      if (fieldInfo.distribution) {
        // Only take top 10 values for visualization
        const entries = Object.entries(fieldInfo.distribution)
          .sort(([, countA]: [string, number], [, countB]: [string, number]) => (countB as number) - (countA as number))
          .slice(0, 10);
        
        entries.forEach(([value, count]: [string, any]) => {
          result.push({
            name: `${field}: ${value}`,
            value: count
          });
        });
      }
    });
  }
  
  return result.length > 0 ? result : [];
};

// Add the missing function that's being imported in datasetService.ts
export const transformSampleDataForCategory = (category: string, data: any[]): any[] => {
  // Basic implementation to transform data based on category
  if (!data || data.length === 0) return [];
  
  // Just return the data as is for now - this function would normally customize
  // the visualization data based on the category
  return data.map(item => ({
    ...item,
    // Apply any category-specific transformations here
    value: typeof item.value === 'number' ? item.value : 0
  }));
};
