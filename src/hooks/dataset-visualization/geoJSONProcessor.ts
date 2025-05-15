
import { Dataset } from '@/types/dataset';
import { getGeoJSONForDataset } from '@/services/visualization/datasetProcessor';
import { createSimplifiedGeoJSON } from './geojsonUtils';

/**
 * Processes and retrieves GeoJSON data for a dataset
 */
export async function processGeoJSONForDataset(
  dataset: Dataset, 
  visualizationData: any[]
): Promise<any | null> {
  try {
    // Check for GeoJSON data
    if (dataset.id) {
      const geoData = await getGeoJSONForDataset(dataset.id);
      if (geoData) {
        console.log("GeoJSON data found for dataset:", dataset.id);
        return geoData;
      } else {
        // For electricity datasets, try to create a simplified GeoJSON if none exists
        if (dataset.category.toLowerCase().includes('electricity') || 
            dataset.category.toLowerCase().includes('power') ||
            dataset.category.toLowerCase().includes('energy')) {
          
          console.log("Creating simplified GeoJSON for electricity dataset");
          const simplifiedGeoJSON = createSimplifiedGeoJSON(visualizationData, dataset.category);
          if (simplifiedGeoJSON) {
            // Store it for future use
            try {
              localStorage.setItem(`geojson_${dataset.id}`, JSON.stringify(simplifiedGeoJSON));
            } catch (e) {
              console.warn("Could not store simplified GeoJSON in localStorage:", e);
            }
            
            return simplifiedGeoJSON;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error processing GeoJSON data:", error);
    return null;
  }
}
