
import { Dataset } from '@/types/dataset';

import { parseDataByFormat } from './processors/formatProcessor';
import { enhanceGeoJSON, simplifyGeoJSON } from './processors/geoJsonProcessor';
import { getGeoJSONForDataset, storeGeoJSONForDataset } from './storage/geoJsonStorage';

// Parse data from file URL
export const parseDataFromFile = async (dataset: Dataset): Promise<any[]> => {
  try {
    const response = await fetch(dataset.file as string);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    // Clone the response before processing for GeoJSON storage
    let responseForStorage: Response | null = null;
    if (dataset.format.toLowerCase() === 'geojson' && dataset.id) {
      responseForStorage = response.clone();
    }
    
    // Process based on format
    const data = await parseDataByFormat(dataset, response);
    
    // Handle GeoJSON storage for map visualizations
    if (dataset.format.toLowerCase() === 'geojson' && dataset.id && responseForStorage) {
      try {
        const json = await responseForStorage.json();
        
        // First, check if the JSON is valid GeoJSON
        if (!json.type || !json.features) {
          console.warn("Invalid GeoJSON structure:", json);
          return data;
        }
        
        // Process GeoJSON for advanced visualizations
        enhanceGeoJSON(json, dataset.category);
        
        // If the JSON string is too large, store a simplified version
        if (JSON.stringify(json).length > 5000000) { // ~5MB
          console.warn("GeoJSON file is very large, storing simplified version");
          const simplified = simplifyGeoJSON(json);
          storeGeoJSONForDataset(dataset.id, simplified);
        } else {
          storeGeoJSONForDataset(dataset.id, json);
        }
      } catch (e) {
        console.warn("Could not process GeoJSON for storage:", e);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error processing dataset file:', error);
    return [];
  }
};

// Re-export getGeoJSONForDataset for backward compatibility
export { getGeoJSONForDataset } from './storage/geoJsonStorage';
