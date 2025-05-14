
// This file is maintained for backward compatibility
// It re-exports verification services from modular structure
export {
  fetchDatasetsWithVerificationStatus,
  updateDatasetVerificationStatus,
  publishDataset,
  sendDatasetFeedback,
  fetchPendingDatasetCount
} from './verification';
