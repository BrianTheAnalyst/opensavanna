
/**
 * IndexedDB storage utilities for GeoJSON data
 */

// Helper function to open IndexedDB
export function openGeoJSONDatabase(): Promise<IDBDatabase> {
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

// Store GeoJSON in IndexedDB
export async function storeInIndexedDB(datasetId: string, geoJSON: any): Promise<boolean> {
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
    
    // Use the oncomplete event
    return new Promise((resolve) => {
      tx.oncomplete = () => { resolve(true); };
      tx.onerror = () => {
        console.warn('Failed to store in IndexedDB');
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('Error accessing IndexedDB:', err);
    return false;
  }
}

// Retrieve GeoJSON from IndexedDB
export async function getFromIndexedDB(datasetId: string): Promise<any | null> {
  try {
    const db = await openGeoJSONDatabase();
    const tx = db.transaction('geojson', 'readonly');
    const store = tx.objectStore('geojson');
    
    // Use a proper Promise to handle IDBRequest
    const result = await new Promise<any>((resolve, reject) => {
      const request = store.get(datasetId);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = () => { reject(request.error); };
    });
    
    return result && result.data ? result.data : null;
  } catch (err) {
    console.warn('Error retrieving from IndexedDB:', err);
    return null;
  }
}
