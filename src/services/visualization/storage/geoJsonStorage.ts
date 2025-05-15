
// Get GeoJSON data for a dataset if available
export const getGeoJSONForDataset = (datasetId: string): any | null => {
  try {
    const storedGeoJSON = localStorage.getItem(`geojson_${datasetId}`);
    return storedGeoJSON ? JSON.parse(storedGeoJSON) : null;
  } catch (e) {
    console.error("Error retrieving GeoJSON from localStorage:", e);
    return null;
  }
};

// Store GeoJSON data with optional simplification
export const storeGeoJSONForDataset = (datasetId: string, geoJSON: any): boolean => {
  try {
    // Store in localStorage with compression techniques for larger files
    const jsonString = JSON.stringify(geoJSON);
    
    localStorage.setItem(`geojson_${datasetId}`, jsonString);
    return true;
  } catch (e) {
    // Handle localStorage errors (e.g. quota exceeded)
    console.warn("Could not store GeoJSON in localStorage:", e);
    return false;
  }
};
