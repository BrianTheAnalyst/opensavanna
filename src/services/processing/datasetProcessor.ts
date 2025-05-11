
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dataset } from "@/types/dataset";
import { processCSVFile, processJSONFile, processGeoJSONFile } from './fileProcessors';

/**
 * Process an uploaded dataset file, extracting real data and insights
 */
export const processDatasetFile = async (file: File, datasetId: string): Promise<any> => {
  try {
    // First, create an entry in the processed_files table to track processing
    const { data: processedFile, error: processError } = await supabase
      .from('processed_files')
      .insert({
        original_filename: file.name,
        file_type: file.type,
        file_size_kb: Math.round(file.size / 1024),
        storage_path: `${datasetId}/${file.name}`,
        processing_status: 'processing'
      })
      .select()
      .single();

    if (processError) {
      console.error('Error tracking file processing:', processError);
      return null;
    }

    // Process file based on its type
    let processedData = null;
    let summary = null;

    if (file.type === 'text/csv') {
      const result = await processCSVFile(file);
      processedData = result.data;
      summary = result.summary;
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const result = await processJSONFile(file);
      processedData = result.data;
      summary = result.summary;
    } else if (file.type === 'application/geo+json' || file.name.endsWith('.geojson')) {
      const result = await processGeoJSONFile(file);
      processedData = result.data;
      summary = result.summary;
    }

    // Update processed file record with results
    if (processedData && summary) {
      await supabase
        .from('processed_files')
        .update({
          processing_status: 'completed',
          summary: summary
        })
        .eq('id', processedFile.id);
    }

    return processedData;
  } catch (error) {
    console.error('Error processing dataset file:', error);
    toast.error('Failed to process dataset file');
    return null;
  }
};
