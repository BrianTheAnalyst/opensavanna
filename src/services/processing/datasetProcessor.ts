
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dataset } from "@/types/dataset";
import { 
  processFileContent, 
  getFileTypeHandler
} from './fileProcessingManager';
import { createProcessedFileRecord, updateProcessedFileRecord } from './processedFileRecords';
import { logger } from '../logging/logger';

/**
 * Process an uploaded dataset file, extracting real data and insights
 */
export const processDatasetFile = async (file: File, datasetId: string): Promise<any> => {
  try {
    // Create an entry in the processed_files table to track processing
    const processedFile = await createProcessedFileRecord({
      original_filename: file.name,
      file_type: file.type,
      file_size_kb: Math.round(file.size / 1024),
      storage_path: `${datasetId}/${file.name}`,
      processing_status: 'processing'
    });

    if (!processedFile) {
      throw new Error('Failed to create processed file record');
    }

    // Process file based on its type
    const fileHandler = getFileTypeHandler(file);
    logger.debug(`Processing ${file.name} using ${fileHandler.name} handler`);
    
    const result = await fileHandler.processFile(file);
    
    if (!result || !result.data) {
      throw new Error('File processing failed to produce valid data');
    }

    // Update processed file record with results
    if (result.data && result.summary) {
      await updateProcessedFileRecord(processedFile.id, {
        processing_status: 'completed',
        summary: result.summary
      });
      // Also update the dataset table
      await supabase.from('datasets').update({ summary: result.summary, quality_report: result.quality_report }).eq('id', datasetId);
    }

    return result;
  } catch (error) {
    logger.error('Error processing dataset file:', error);
    toast.error('Failed to process dataset file');
    return null;
  }
};
