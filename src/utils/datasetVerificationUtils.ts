
import { Dataset, DatasetWithEmail } from '@/types/dataset';

/**
 * Returns the appropriate class for verification status badge
 * @param status The verification status
 * @returns CSS class string
 */
export const getVerificationStatusClass = (status?: string): string => {
  if (!status || status === 'pending') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  } else if (status === 'approved') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  } else if (status === 'rejected') {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
  return '';
};

/**
 * Returns a human-readable label for verification status
 * @param status The verification status
 * @returns Human-readable string
 */
export const getVerificationStatusLabel = (status?: string): string => {
  if (!status || status === 'pending') {
    return 'Pending Review';
  } else if (status === 'approved') {
    return 'Approved';
  } else if (status === 'rejected') {
    return 'Rejected';
  }
  return 'Unknown';
};

/**
 * Filters datasets by their verification status
 * @param datasets Array of datasets
 * @param status Status to filter by ('pending', 'approved', 'rejected')
 * @returns Filtered array of datasets
 */
export const filterDatasetsByVerificationStatus = (
  datasets: DatasetWithEmail[], 
  status: 'pending' | 'approved' | 'rejected'
): DatasetWithEmail[] => {
  if (status === 'pending') {
    return datasets.filter(d => !d.verificationStatus || d.verificationStatus === 'pending');
  }
  return datasets.filter(d => d.verificationStatus === status);
};

/**
 * Adds a verification badge to the dataset card HTML
 * @param dataset The dataset object
 * @returns HTML string for the verification badge
 */
export const renderVerificationBadge = (dataset: Dataset): string => {
  const statusClass = getVerificationStatusClass(dataset.verificationStatus);
  const statusLabel = getVerificationStatusLabel(dataset.verificationStatus);
  
  return `<span class="px-2 py-1 text-xs rounded-full ${statusClass}">${statusLabel}</span>`;
};
