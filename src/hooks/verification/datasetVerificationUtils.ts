
import { DatasetWithEmail } from "@/types/dataset";

/**
 * Normalize dataset properties for consistency
 * This ensures all datasets have consistent property names regardless of database column naming
 */
export const normalizeDataset = (dataset: any): DatasetWithEmail => {
  // First make a clean copy of the dataset to avoid reference issues
  const normalizedDataset = { ...dataset };
  
  // Ensure verification status uses the TypeScript property
  normalizedDataset.verificationStatus = dataset.verificationStatus || dataset.verification_status || 'pending';
  normalizedDataset.verificationNotes = dataset.verificationNotes || dataset.verification_notes;
  
  // For debugging
  console.log(`Normalized dataset ${dataset.id}: status = ${normalizedDataset.verificationStatus}, original_status = ${dataset.verification_status}`);
  
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
    return datasets.filter(d => !d.verificationStatus || d.verificationStatus === 'pending');
  }
  return datasets.filter(d => d.verificationStatus === status);
};
