
import { useState, useEffect, useCallback } from 'react';
import { Dataset } from '@/types/dataset';
import { getGeoJSONForDataset } from '@/services/visualization/storage/geoJsonStorage';
import { createSimplifiedGeoJSON } from './geojsonUtils';
import { simplifyGeometry } from '@/services/visualization/processors/geoJsonProcessor';

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
        try {
          const db = await openGeoJSONDatabase();
          const tx = db.transaction('geojson', 'readwrite');
          const store = tx.objectStore('geojson');
          
          // Store with dataset ID as key
          await store.put({
            id: datasetId,
            data: geoJSON,
            timestamp: Date.now()
          });
          
          // Use the oncomplete event instead of complete property
          return new Promise((resolve) => {
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => {
              console.warn('Failed to store in IndexedDB, falling back to localStorage');
              resolve(false);
            };
          });
        } catch (err) {
          console.warn('Failed to store in IndexedDB, falling back to localStorage:', err);
          // Fall back to localStorage
        }
      }
      
      // Use localStorage as fallback
      try {
        const jsonString = JSON.stringify(geoJSON);
        
        // If the string is too large for localStorage, try to simplify it
        if (jsonString.length > 5000000 && attemptSimplification) { // ~5MB
          // Create a more simplified version
          const simplifiedGeoJSON = {
            ...geoJSON,
            features: geoJSON.features?.slice(0, 100).map((feature: any) => ({
              type: feature.type,
              properties: feature.properties,
              geometry: feature.geometry ? {
                type: feature.geometry.type,
                coordinates: simplifyCoordinates(feature.geometry)
              } : null
            }))
          };
          
          localStorage.setItem(`geojson_${datasetId}`, JSON.stringify(simplifiedGeoJSON));
        } else {
          localStorage.setItem(`geojson_${datasetId}`, jsonString);
        }
        
        return true;
      } catch (err) {
        console.error('Failed to store GeoJSON:', err);
        return false;
      }
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
        try {
          const db = await openGeoJSONDatabase();
          const tx = db.transaction('geojson', 'readonly');
          const store = tx.objectStore('geojson');
          
          // Use a proper Promise to handle IDBRequest
          const result = await new Promise<any>((resolve, reject) => {
            const request = store.get(datasetId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          
          if (result && result.data) {
            return result.data;
          }
        } catch (err) {
          console.warn('Failed to retrieve from IndexedDB, trying localStorage:', err);
        }
      }
      
      // Try localStorage next
      try {
        const storedGeoJSON = localStorage.getItem(`geojson_${datasetId}`);
        return storedGeoJSON ? JSON.parse(storedGeoJSON) : null;
      } catch (localErr) {
        console.warn('Failed to retrieve from localStorage:', localErr);
      }
      
      return null;
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

// Helper function to open IndexedDB
function openGeoJSONDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DataVisualizationGeoJSON', 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Create object store for GeoJSON data if it doesn't exist
      if (!db.objectStoreNames.contains('geojson')) {
        db.createObjectStore('geojson', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// Helper function to simplify coordinates
function simplifyCoordinates(geometry: any): any {
  if (!geometry || !geometry.coordinates) return geometry?.coordinates;
  
  const { type, coordinates } = geometry;
  
  switch (type) {
    case 'Point':
      return coordinates;
      
    case 'LineString':
      return coordinates.filter((_: any, i: number) => i % 5 === 0 || i === coordinates.length - 1);
      
    case 'Polygon':
      return coordinates.map((ring: any[]) => 
        ring.filter((_: any, i: number) => i % 5 === 0 || i === ring.length - 1)
      );
      
    case 'MultiPoint':
      return coordinates.filter((_: any, i: number) => i % 5 === 0 || i === coordinates.length - 1);
      
    case 'MultiLineString':
      return coordinates.map((line: any[]) => 
        line.filter((_: any, i: number) => i % 5 === 0 || i === line.length - 1)
      );
      
    case 'MultiPolygon':
      return coordinates.map((polygon: any[]) => 
        polygon.map((ring: any[]) => 
          ring.filter((_: any, i: number) => i % 5 === 0 || i === ring.length - 1)
        )
      );
      
    default:
      return coordinates;
  }
}
