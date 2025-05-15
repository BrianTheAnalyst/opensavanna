
import { useState, useEffect } from 'react';

// Create a type for the worker responses
type WorkerResponse = 
  | { type: 'PROCESS_COMPLETE', processedGeoJSON: any }
  | { type: 'SIMPLIFY_COMPLETE', simplifiedGeoJSON: any }
  | { type: 'ERROR', error: string };

export function useGeoJsonWorker() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize worker
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Create the worker
      const geoJsonWorker = new Worker(
        new URL('../../workers/geoJsonWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      setWorker(geoJsonWorker);
      
      // Cleanup function
      return () => {
        geoJsonWorker.terminate();
      };
    } catch (err) {
      console.error('Error initializing GeoJSON worker:', err);
      setError('Failed to initialize worker for GeoJSON processing');
    }
  }, []);
  
  // Function to process GeoJSON data in the worker
  const processGeoJSON = (geoJSON: any, timeIndex?: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!worker) {
        // If worker isn't available, process directly
        try {
          // Simple filtering by time index
          if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features) || timeIndex === undefined) {
            resolve(geoJSON);
            return;
          }
          
          const filteredFeatures = geoJSON.features.filter((feature: any) => {
            if (!feature.properties) return true;
            if (feature.properties.timeIndex !== undefined) {
              return feature.properties.timeIndex === timeIndex;
            }
            return true;
          });
          
          resolve({
            ...geoJSON,
            features: filteredFeatures
          });
        } catch (err) {
          reject(err instanceof Error ? err.message : 'Error processing GeoJSON');
        }
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      
      // Set up one-time message handler
      const handleMessage = (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;
        
        if (response.type === 'PROCESS_COMPLETE') {
          worker.removeEventListener('message', handleMessage);
          setIsProcessing(false);
          resolve(response.processedGeoJSON);
        } else if (response.type === 'ERROR') {
          worker.removeEventListener('message', handleMessage);
          setIsProcessing(false);
          setError(response.error);
          reject(response.error);
        }
      };
      
      worker.addEventListener('message', handleMessage);
      
      // Send message to worker
      worker.postMessage({
        type: 'PROCESS_GEOJSON',
        geoJSON,
        timeIndex
      });
    });
  };
  
  // Function to simplify GeoJSON data
  const simplifyGeoJSON = (geoJSON: any, simplificationFactor: number = 5): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!worker) {
        reject('Worker not available');
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      
      // Set up one-time message handler
      const handleMessage = (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;
        
        if (response.type === 'SIMPLIFY_COMPLETE') {
          worker.removeEventListener('message', handleMessage);
          setIsProcessing(false);
          resolve(response.simplifiedGeoJSON);
        } else if (response.type === 'ERROR') {
          worker.removeEventListener('message', handleMessage);
          setIsProcessing(false);
          setError(response.error);
          reject(response.error);
        }
      };
      
      worker.addEventListener('message', handleMessage);
      
      // Send message to worker
      worker.postMessage({
        type: 'SIMPLIFY_GEOJSON',
        geoJSON,
        simplificationFactor
      });
    });
  };

  return {
    processGeoJSON,
    simplifyGeoJSON,
    isProcessing,
    error
  };
}
