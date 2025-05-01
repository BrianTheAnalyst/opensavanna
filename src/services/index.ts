
// Re-export all service functions
export * from './datasetService';
export * from './datasetVisualizationService';
export * from './datasetAnalyticsService';
export * from './datasetAdminService'; 
export * from './datasetUploadService';
export * from './datasetDownloadService';
export * from './entityService';
export { 
  hasUserRole, 
  assignUserRole, 
  removeUserRole, 
  getUserRoles,
} from './userRoleService';
export type { UserRole } from './userRoleService';
export { sampleVisData } from '@/data/visualizationData';
export type { Dataset, DatasetFilters } from '@/types/dataset';

