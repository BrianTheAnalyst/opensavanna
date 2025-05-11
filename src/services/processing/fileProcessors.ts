
import * as Papa from "papaparse";

/**
 * Process a CSV file and extract data and summary statistics
 */
export const processCSVFile = async (file: File): Promise<{ data: any[], summary: any }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const data = results.data.filter(row => 
            Object.values(row).some(value => value !== null && value !== undefined)
          );
          
          if (!data.length) {
            reject(new Error('No valid data found in CSV'));
            return;
          }

          // Generate summary statistics
          const summary = generateDataSummary(data);
          
          resolve({
            data: data.slice(0, 1000), // Limit to first 1000 rows for performance
            summary
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Process a JSON file and extract data and summary statistics
 */
export const processJSONFile = async (file: File): Promise<{ data: any[], summary: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        const data = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        // Generate summary statistics
        const summary = generateDataSummary(data);
        
        resolve({
          data: data.slice(0, 1000), // Limit to first 1000 rows for performance
          summary
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Process a GeoJSON file and extract data and summary statistics
 */
export const processGeoJSONFile = async (file: File): Promise<{ data: any[], summary: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const geoJson = JSON.parse(event.target?.result as string);
        
        if (!geoJson.features || !Array.isArray(geoJson.features)) {
          reject(new Error('Invalid GeoJSON format'));
          return;
        }
        
        // Convert GeoJSON features to a more analysis-friendly format
        const data = geoJson.features.map((feature: any) => ({
          ...feature.properties,
          geometry_type: feature.geometry?.type,
          coordinates_count: feature.geometry?.coordinates ? 
            (Array.isArray(feature.geometry.coordinates[0]) ? 
              feature.geometry.coordinates.length : 
              1) : 
            0
        }));
        
        // Generate summary statistics
        const summary = {
          feature_count: geoJson.features.length,
          geometry_types: [...new Set(data.map((d: any) => d.geometry_type))],
          property_fields: Object.keys(geoJson.features[0]?.properties || {}),
          bounds: calculateGeoBounds(geoJson)
        };
        
        resolve({
          data: data.slice(0, 1000), // Limit to first 1000 features for performance
          summary
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

// Import from the statistics utility file
import { generateDataSummary, calculateGeoBounds } from './statisticsUtils';
