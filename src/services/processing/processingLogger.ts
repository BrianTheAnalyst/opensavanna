/**
 * Logger for dataset processing operations
 */
export const consoleLogger = {
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
