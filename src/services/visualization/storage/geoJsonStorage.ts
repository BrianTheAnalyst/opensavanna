
// Get GeoJSON data for a dataset if available
export const getGeoJSONForDataset = (datasetId: string): any | null => {
  try {
    // First try to get from session storage for better performance during the current session
    const sessionGeoJSON = sessionStorage.getItem(`geojson_${datasetId}`);
    if (sessionGeoJSON) {
      return JSON.parse(sessionGeoJSON);
    }
    
    // Fall back to localStorage if not in session storage
    const storedGeoJSON = localStorage.getItem(`geojson_${datasetId}`);
    if (storedGeoJSON) {
      // Cache in session storage for faster access in this session
      try {
        sessionStorage.setItem(`geojson_${datasetId}`, storedGeoJSON);
      } catch (e) {
        // Ignore session storage errors - we still have the data from localStorage
        console.warn("Could not store in sessionStorage:", e);
      }
      return JSON.parse(storedGeoJSON);
    }
    
    return null;
  } catch (e) {
    console.error("Error retrieving GeoJSON from storage:", e);
    return null;
  }
};

// Store GeoJSON data with optional simplification
export const storeGeoJSONForDataset = (datasetId: string, geoJSON: any): boolean => {
  try {
    // Store in localStorage with compression techniques for larger files
    const jsonString = JSON.stringify(geoJSON);
    
    // Check if the data is too large for localStorage (typically ~5MB limit)
    if (jsonString.length > 4000000) { // ~4MB to be safe
      console.warn(`GeoJSON for dataset ${datasetId} is very large (${(jsonString.length/1024/1024).toFixed(2)}MB). Consider simplifying.`);
      // We could add automatic simplification here in the future
    }
    
    // Store in both storages for redundancy and performance
    localStorage.setItem(`geojson_${datasetId}`, jsonString);
    try {
      sessionStorage.setItem(`geojson_${datasetId}`, jsonString);
    } catch (e) {
      // Ignore session storage errors - we already stored in localStorage
      console.warn("Could not store GeoJSON in sessionStorage:", e);
    }
    
    return true;
  } catch (e) {
    // Handle localStorage errors (e.g. quota exceeded)
    console.warn("Could not store GeoJSON in localStorage:", e);
    
    // Try to store just in session storage as a fallback
    try {
      const jsonString = JSON.stringify(geoJSON);
      sessionStorage.setItem(`geojson_${datasetId}`, jsonString);
      return true;
    } catch (sessionError) {
      console.error("Could not store GeoJSON in any storage:", sessionError);
      return false;
    }
  }
};

// Helper function to clear stored GeoJSON data
export const clearGeoJSONForDataset = (datasetId: string): void => {
  try {
    localStorage.removeItem(`geojson_${datasetId}`);
    sessionStorage.removeItem(`geojson_${datasetId}`);
  } catch (e) {
    console.error("Error clearing GeoJSON data:", e);
  }
};

// Get an estimate of how much storage is being used by GeoJSON data
export const getGeoJSONStorageUsage = (): { count: number, sizeKB: number } => {
  try {
    let count = 0;
    let totalSize = 0;
    
    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('geojson_')) {
        count++;
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }
    }
    
    return {
      count,
      sizeKB: Math.round(totalSize / 1024)
    };
  } catch (e) {
    console.error("Error calculating GeoJSON storage usage:", e);
    return { count: 0, sizeKB: 0 };
  }
};
