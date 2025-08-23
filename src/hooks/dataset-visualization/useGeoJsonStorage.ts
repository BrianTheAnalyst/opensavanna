
import { useState, useEffect, useCallback } from 'react';

import { simplifyGeometry } from '@/services/visualization/processors/geoJsonProcessor';
import { getGeoJSONForDataset } from '@/services/visualization/storage/geoJsonStorage';
import { Dataset } from '@/types/dataset';

import { createSimplifiedGeoJSON } from './geojsonUtils';
import { storeInIndexedDB, getFromIndexedDB } from './storage/indexedDbStorage';
import { storeInLocalStorage, getFromLocalStorage } from './storage/localStorageUtils';


interface UseGeoJsonStorageOptions {
  preferIndexedDB?: boolean;
  attemptSimplification?: boolean;
}

export function useGeoJsonStorage({
  preferIndexedDB = true,
  attemptSimplification = true
}: UseGeoJsonStorageOptions = {}) {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isIndexedDBAvailable, setIsIndexedDBAvailable] = useState(false);
  
  // Check for IndexedDB support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isDBAvailable = 'indexedDB' in window;
    setIsIndexedDBAvailable(isDBAvailable);
    setIsStorageReady(true);
  }, []);
  
  // Store GeoJSON with fallback options
  const storeGeoJSON = useCallback(async (datasetId: string, geoJSON: any): Promise<boolean> => {
    if (!isStorageReady) return false;
    
    try {
      // Try IndexedDB first if preferred and available
      if (preferIndexedDB && isIndexedDBAvailable) {
        const stored = await storeInIndexedDB(datasetId, geoJSON);
        if (stored) return true;
        // Fall back to localStorage if IndexedDB fails
      }
      
      // Use localStorage as fallback
      return storeInLocalStorage(datasetId, geoJSON, attemptSimplification);
    } catch (err) {
      console.error('Error storing GeoJSON:', err);
      return false;
    }
  }, [isStorageReady, isIndexedDBAvailable, preferIndexedDB, attemptSimplification]);
  
  // Get GeoJSON with fallbacks
  const getGeoJSON = useCallback(async (datasetId: string): Promise<any | null> => {
    if (!isStorageReady) return null;
    
    try {
      // Try IndexedDB first if available
      if (isIndexedDBAvailable) {
        const indexedDBData = await getFromIndexedDB(datasetId);
        if (indexedDBData) return indexedDBData;
      }
      
      // Try localStorage next
      return getFromLocalStorage(datasetId);
    } catch (err) {
      console.error('Error retrieving GeoJSON:', err);
      return null;
    }
  }, [isStorageReady, isIndexedDBAvailable]);
  
  // Process and retrieve GeoJSON for a dataset
  const processGeoJSONForDataset = useCallback(async (
    dataset: Dataset, 
    visualizationData: any[]
  ): Promise<any | null> => {
    try {
      // Check for GeoJSON data by dataset ID
      if (dataset.id) {
        // First try to get from storage
        const geoData = await getGeoJSON(dataset.id);
        
        if (geoData) {
          console.log("GeoJSON data found in storage for dataset:", dataset.id);
          return geoData;
        }
        
        // If not in storage, try to get from dataset processor
        const serviceGeoData = await getGeoJSONForDataset(dataset.id);
        
        if (serviceGeoData) {
          console.log("GeoJSON data retrieved from service for dataset:", dataset.id);
          // Store it for future use
          storeGeoJSON(dataset.id, serviceGeoData);
          return serviceGeoData;
        }
        
        // For electricity/energy datasets, try to create a simplified GeoJSON
        if (dataset.category.toLowerCase().includes('electricity') || 
            dataset.category.toLowerCase().includes('power') ||
            dataset.category.toLowerCase().includes('energy')) {
          
          console.log("Creating simplified GeoJSON for electricity dataset");
          const simplifiedGeoJSON = createSimplifiedGeoJSON(visualizationData, dataset.category);
          
          if (simplifiedGeoJSON) {
            // Store it for future use
            storeGeoJSON(dataset.id, simplifiedGeoJSON);
            return simplifiedGeoJSON;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error processing GeoJSON data:", error);
      return null;
    }
  }, [getGeoJSON, storeGeoJSON]);
  
  return {
    storeGeoJSON,
    getGeoJSON,
    processGeoJSONForDataset,
    isStorageReady,
    isIndexedDBAvailable
  };
}
