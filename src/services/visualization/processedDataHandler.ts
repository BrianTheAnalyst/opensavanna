
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

// Generate visualization data from processed file summary
export const generateVisualizationDataFromSummary = (summary: any, category: string): any[] => {
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
          .sort(([, countA]: [string, number], [, countB]: [string, number]) => (countB) - (countA))
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

// Get processed data for a dataset
export const getProcessedDataForDataset = async (dataset: Dataset): Promise<any[]> => {
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
