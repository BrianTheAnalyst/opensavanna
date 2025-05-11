
/**
 * Logger for dataset processing operations
 */
export const processingLogger = {
  debug: (message: string, ...args: any[]) => {
    console.log(`[DatasetProcessing] DEBUG: ${message}`, ...args);
  },
  
  info: (message: string, ...args: any[]) => {
    console.log(`[DatasetProcessing] INFO: ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[DatasetProcessing] WARNING: ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[DatasetProcessing] ERROR: ${message}`, ...args);
  }
};

export const logProcessingEvent = (
  datasetId: string,
  eventType: 'start' | 'complete' | 'error',
  details?: any
) => {
  processingLogger.info(`Processing event: ${eventType} for dataset ${datasetId}`, details);
  
  // This could be extended in the future to log events to a database or analytics service
};
