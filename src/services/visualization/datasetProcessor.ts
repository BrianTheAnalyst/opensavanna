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
        // First, check if the JSON is valid GeoJSON
        if (!json.type || !json.features) {
          console.warn("Invalid GeoJSON structure:", json);
          return [];
        }
        
        // Process GeoJSON for advanced visualizations
        enhanceGeoJSON(json);
        
        // Store in localStorage with compression techniques for larger files
        const jsonString = JSON.stringify(json);
        
        // If the JSON string is too large, store a simplified version
        if (jsonString.length > 5000000) { // ~5MB
          console.warn("GeoJSON file is very large, storing simplified version");
          const simplified = simplifyGeoJSON(json);
          localStorage.setItem(`geojson_${dataset.id}`, JSON.stringify(simplified));
        } else {
          localStorage.setItem(`geojson_${dataset.id}`, jsonString);
        }
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

// Enhance GeoJSON with additional data and properties for visualization
const enhanceGeoJSON = (geoJSON: any): void => {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) return;
  
  // Extract all numeric property fields that might be useful for choropleth maps
  const numericFields: {[key: string]: {min: number, max: number}} = {};
  
  geoJSON.features.forEach((feature: any) => {
    if (!feature.properties) return;
    
    Object.entries(feature.properties).forEach(([key, value]) => {
      if (typeof value === 'number' || (typeof value === 'string' && !isNaN(+value))) {
        const numValue = typeof value === 'string' ? +value : value as number;
        if (!numericFields[key]) {
          numericFields[key] = { min: numValue, max: numValue };
        } else {
          numericFields[key].min = Math.min(numericFields[key].min, numValue);
          numericFields[key].max = Math.max(numericFields[key].max, numValue);
        }
      }
    });
  });
  
  // Store metadata about numeric fields in the GeoJSON object
  if (!geoJSON.metadata) geoJSON.metadata = {};
  geoJSON.metadata.numericFields = numericFields;
};

// Simplify GeoJSON to fit in localStorage
const simplifyGeoJSON = (geoJSON: any): any => {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) {
    return geoJSON;
  }
  
  // Create a simplified version with fewer points in geometries
  const simplified = {
    type: geoJSON.type,
    features: geoJSON.features.slice(0, 100).map((feature: any) => {
      // Keep properties and basic structure
      return {
        type: feature.type,
        properties: feature.properties,
        geometry: simplifyGeometry(feature.geometry)
      };
    }),
    metadata: geoJSON.metadata
  };
  
  return simplified;
};

// Define geometry types for better type safety
interface GeometryWithType {
  type: string;
  coordinates?: any;
}

// Simplify geometry by reducing points
const simplifyGeometry = (geometry: GeometryWithType | null): GeometryWithType | null => {
  if (!geometry) return geometry;
  
  // Keep the type
  const simplifiedGeometry: GeometryWithType = {
    type: geometry.type,
    coordinates: undefined
  };
  
  // Simplify coordinates based on geometry type
  switch (geometry.type) {
    case 'Point':
      // Points don't need simplification
      simplifiedGeometry.coordinates = geometry.coordinates;
      break;
    
    case 'LineString':
      // Take every nth point for simplification
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = reducePoints(geometry.coordinates, 5);
      }
      break;
    
    case 'Polygon':
      // Simplify each ring of the polygon
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.map((ring: any[]) => 
          reducePoints(ring, 5)
        );
      }
      break;
    
    case 'MultiPoint':
      // Take a subset of points
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.slice(0, 
          Math.min(geometry.coordinates.length, 50));
      }
      break;
    
    case 'MultiLineString':
      // Simplify each linestring
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.map((line: any[]) => 
          reducePoints(line, 5)
        );
      }
      break;
    
    case 'MultiPolygon':
      // Simplify each polygon
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.map((polygon: any[]) => 
          polygon.map((ring: any[]) => reducePoints(ring, 5))
        );
      }
      break;
    
    default:
      // For unsupported types, keep as is
      simplifiedGeometry.coordinates = geometry.coordinates;
  }
  
  return simplifiedGeometry;
};

// Take every nth point from an array of points
const reducePoints = (points: any[], nth: number): any[] => {
  if (!points || points.length <= 2) return points;
  
  const result = [points[0]]; // Always include the first point
  
  for (let i = 1; i < points.length - 1; i++) {
    if (i % nth === 0) {
      result.push(points[i]);
    }
  }
  
  result.push(points[points.length - 1]); // Always include the last point
  
  return result;
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
