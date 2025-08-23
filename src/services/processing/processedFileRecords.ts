
import { v4 as uuidv4 } from 'uuid';

import { supabase } from "@/integrations/supabase/client";

import { processingLogger } from './processingLogger';

interface ProcessedFileRecord {
  id: string;
  original_filename: string;
  file_type: string;
  file_size_kb: number;
  storage_path: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  summary?: any;
  processed_path?: string;
  errors?: string[];
  user_id?: string;
}

interface CreateProcessedFileParams {
  original_filename: string;
  file_type: string;
  file_size_kb: number;
  storage_path: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  user_id?: string;
}

/**
 * Create a new processed file record
 */
export const createProcessedFileRecord = async (
  params: CreateProcessedFileParams
): Promise<ProcessedFileRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('processed_files')
      .insert(params)
      .select()
      .single();
    
    if (error) {
      processingLogger.error('Error creating processed file record:', error);
      return null;
    }
    
    return data as ProcessedFileRecord;
  } catch (error) {
    processingLogger.error('Exception creating processed file record:', error);
    return null;
  }
};

/**
 * Update a processed file record
 */
export const updateProcessedFileRecord = async (
  id: string,
  updates: Partial<ProcessedFileRecord>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('processed_files')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      processingLogger.error(`Error updating processed file record ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    processingLogger.error(`Exception updating processed file record ${id}:`, error);
    return false;
  }
};

/**
 * Get a processed file record by ID
 */
export const getProcessedFileRecord = async (
  id: string
): Promise<ProcessedFileRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('processed_files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      processingLogger.error(`Error fetching processed file record ${id}:`, error);
      return null;
    }
    
    return data as ProcessedFileRecord;
  } catch (error) {
    processingLogger.error(`Exception fetching processed file record ${id}:`, error);
    return null;
  }
};

/**
 * Get processed file records for a dataset
 */
export const getProcessedFileRecordsForDataset = async (
  datasetId: string
): Promise<ProcessedFileRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('processed_files')
      .select('*')
      .like('storage_path', `${datasetId}/%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      processingLogger.error(`Error fetching processed files for dataset ${datasetId}:`, error);
      return [];
    }
    
    return data as ProcessedFileRecord[];
  } catch (error) {
    processingLogger.error(`Exception fetching processed files for dataset ${datasetId}:`, error);
    return [];
  }
};
