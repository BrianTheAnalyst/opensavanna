
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
    const { data: rawDataset, error: fetchError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching dataset:', fetchError);
      toast.error('Failed to load dataset');
      return [];
    }
    
    if (!rawDataset) {
      toast.error('Dataset not found');
      return [];
    }

    // Normalize and validate the verification status to match our type definition
    const dataset: Dataset = {
      ...rawDataset,
      // Make sure verification_status is properly typed or defaulted
      verificationStatus: (rawDataset.verification_status as 'pending' | 'approved' | 'rejected') || 'pending'
    };
    
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
    return [];
  }
};

// Re-export necessary functions
export { transformSampleDataForCategory };
