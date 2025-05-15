
import { Dataset } from '@/types/dataset';
import { parseCSVData, formatJSONForVisualization, formatGeoJSONForVisualization } from '@/utils/dataFormatUtils';

// Parse data from file URL based on format
export const parseDataByFormat = async (dataset: Dataset, response: Response): Promise<any[]> => {
  try {
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
    console.error('Error processing data by format:', error);
    return [];
  }
};
