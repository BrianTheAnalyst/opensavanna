
import { Dataset } from '@/types/dataset';
import { parseCSVData, formatJSONForVisualization, formatGeoJSONForVisualization } from '@/utils/dataFormatUtils';

// Parse data from file URL
export const parseDataFromFile = async (dataset: Dataset): Promise<any[]> => {
  try {
    const response = await fetch(dataset.file as string);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    // Handle different file formats
    if (dataset.format.toLowerCase() === 'csv') {
      const text = await response.text();
      return parseCSVData(text, dataset.category);
    } else if (dataset.format.toLowerCase() === 'json') {
      const json = await response.json();
      return formatJSONForVisualization(json, dataset.category);
    } else if (dataset.format.toLowerCase() === 'geojson') {
      const json = await response.json();
      // Store the original GeoJSON in localStorage for mapping
      try {
        localStorage.setItem(`geojson_${dataset.id}`, JSON.stringify(json));
      } catch (e) {
        // Handle localStorage errors (e.g. quota exceeded)
        console.warn("Could not store GeoJSON in localStorage:", e);
      }
      return formatGeoJSONForVisualization(json, dataset.category);
    } else {
      console.log('Unsupported format');
      return [];
    }
  } catch (error) {
    console.error('Error processing dataset file:', error);
    return [];
  }
};

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
