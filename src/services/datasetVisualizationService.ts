
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

    // Normalize verification status to ensure type safety
    const status = rawDataset.verification_status as string;
    let typedStatus: 'pending' | 'approved' | 'rejected' = 'pending';
    
    // Validate status value to ensure it's one of the expected values
    if (status === 'approved' || status === 'rejected' || status === 'pending') {
      typedStatus = status;
    } else if (status) {
      console.warn(`Unexpected verification status value: ${status}, defaulting to 'pending'`);
    }

    // Create a properly typed Dataset object
    const dataset: Dataset = {
      ...rawDataset,
      verificationStatus: typedStatus,
      verification_status: typedStatus // Ensure both properties have the correct type
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
