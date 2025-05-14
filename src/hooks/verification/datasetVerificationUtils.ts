
import { DatasetWithEmail } from "@/types/dataset";

/**
 * Normalize dataset properties for consistency
 * This ensures all datasets have consistent property names regardless of database column naming
 */
export const normalizeDataset = (dataset: any): DatasetWithEmail => {
  return {
    ...dataset,
    verificationStatus: dataset.verificationStatus || dataset.verification_status || 'pending',
    verificationNotes: dataset.verificationNotes || dataset.verification_notes
  };
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
