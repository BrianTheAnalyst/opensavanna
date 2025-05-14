
import { DatasetWithEmail } from "@/types/dataset";

/**
 * Normalize dataset properties for consistency
 * This ensures all datasets have consistent property names regardless of database column naming
 */
export const normalizeDataset = (dataset: any): DatasetWithEmail => {
  // First make a clean copy of the dataset to avoid reference issues
  const normalizedDataset = { ...dataset };
  
  // Ensure verification status uses the TypeScript property
  // The database uses verification_status, while the UI uses verificationStatus
  normalizedDataset.verificationStatus = dataset.verification_status || 'pending';
  normalizedDataset.verificationNotes = dataset.verification_notes;
  
  return normalizedDataset as DatasetWithEmail;
};

/**
 * Filter datasets by verification status
 */
export const filterDatasetsByStatus = (
  datasets: DatasetWithEmail[],
  status: 'pending' | 'approved' | 'rejected'
): DatasetWithEmail[] => {
  if (status === 'pending') {
    return datasets.filter(d => !d.verification_status || d.verification_status === 'pending');
  }
  return datasets.filter(d => d.verification_status === status);
};

/**
 * Debug helper to check if dataset status is consistent between UI and database
 */
export const validateDatasetStatus = async (id: string, expectedStatus: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Get the current status directly from the database
    const { data, error } = await supabase
      .from('datasets')
      .select('id, verification_status')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error('Failed to validate dataset status:', error);
      return false;
    }
    
    const dbStatus = data.verification_status;
    const isConsistent = dbStatus === expectedStatus;
    
    if (!isConsistent) {
      console.error(`Dataset status mismatch: UI=${expectedStatus}, DB=${dbStatus}`);
    }
    
    return isConsistent;
  } catch (error) {
    console.error('Error validating dataset status:', error);
    return false;
  }
};
