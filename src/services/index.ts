
// Re-export all service functions
export * from './datasetService';
// Export specific functions from datasetFetchService to avoid naming conflicts
export { 
  fetchDatasets 
} from './dataset/datasetFetchService';
export * from './datasetVisualizationService';
export * from './datasetAnalyticsService';
export * from './datasetAdminService'; 
export * from './datasetUploadService';
export * from './datasetDownloadService';
export * from './datasetVerificationService';
export { 
  hasUserRole, 
  assignUserRole, 
  removeUserRole, 
  getUserRoles,
} from './userRoleService';
export type { UserRole } from './userRoleService';
export { sampleVisData } from '@/data/visualizationData';
export type { Dataset, DatasetFilters } from '@/types/dataset';
