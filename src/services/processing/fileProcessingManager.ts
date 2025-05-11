
import { 
  processCSVFile,
  processJSONFile,
  processGeoJSONFile 
} from './fileProcessors';
import { processingLogger } from './processingLogger';

/**
 * Get the appropriate file handler based on file type
 */
export const getFileTypeHandler = (file: File) => {
  // Determine file type based on extension or mime type
  if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
    return { 
      name: 'CSV',
      processFile: processCSVFile
    };
  } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
    return {
      name: 'JSON',
      processFile: processJSONFile
    };
  } else if (file.type === 'application/geo+json' || file.name.endsWith('.geojson')) {
    return {
      name: 'GeoJSON',
      processFile: processGeoJSONFile
    };
  }
  
  // Default handler that will throw an appropriate error
  return {
    name: 'Unknown',
    processFile: async () => {
      processingLogger.error(`Unsupported file type: ${file.type}`);
      throw new Error(`Unsupported file type: ${file.type || 'unknown'}`);
    }
  };
};

/**
 * Process file content based on its content
 * This is a utility function that can be used to process file content
 * regardless of how the content was obtained
 */
export const processFileContent = async (
  content: string | ArrayBuffer,
  fileType: string,
  fileName: string
): Promise<{ data: any[], summary: any }> => {
  const handler = getFileTypeHandler({ 
    type: fileType, 
    name: fileName
  } as File);
  
  // Create a File-like object from the content
  const blob = new Blob([content], { type: fileType });
  const file = new File([blob], fileName, { type: fileType });
  
  return handler.processFile(file);
};
