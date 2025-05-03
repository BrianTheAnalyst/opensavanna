
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";
import { parseDataFromFile } from "./visualization/datasetProcessor";
import { getProcessedDataForDataset } from "./visualization/processedDataHandler";
import { transformSampleDataForCategory } from "./visualization/dataTransformer";

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
    const processedData = await getProcessedDataForDataset(dataset as unknown as Dataset);
    if (processedData.length > 0) {
      return processedData;
    }
    
    // If no processed data, try to parse from file
    if (dataset.file) {
      return await parseDataFromFile(dataset as unknown as Dataset);
    }
    
    // No file available
    return [];
  } catch (error) {
    console.error('Error fetching visualization data:', error);
    return [];
  }
};

// Re-export necessary functions
export { transformSampleDataForCategory };
