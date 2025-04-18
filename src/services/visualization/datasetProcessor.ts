
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
