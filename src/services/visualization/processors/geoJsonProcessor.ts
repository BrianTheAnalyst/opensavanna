import { Dataset } from '@/types/dataset';

// Interface for geometry to provide better type safety
interface GeometryWithType {
  type: string;
  coordinates?: any;
}

// Enhance GeoJSON with additional data and properties for visualization
export const enhanceGeoJSON = (geoJSON: any, category?: string): void => {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) return;
  
  // Extract all numeric property fields that might be useful for choropleth maps
  const numericFields: {[key: string]: {min: number, max: number}} = {};
  
  // Prioritize fields based on category
  let priorityFields: string[] = ['value', 'data'];
  
  // For electricity/energy data, prioritize those specific fields
  if (category?.toLowerCase().includes('electricity') || category?.toLowerCase().includes('energy') || 
      category?.toLowerCase().includes('power')) {
    priorityFields = ['electricity', 'consumption', 'power', 'energy', 'kwh', 'mwh', 'watts', ...priorityFields];
  }
  
  geoJSON.features.forEach((feature: any) => {
    if (!feature.properties) return;
    
    // First check priority fields
    for (const field of priorityFields) {
      const value = feature.properties[field];
      if (value !== undefined && (typeof value === 'number' || (typeof value === 'string' && !isNaN(+value)))) {
        const numValue = typeof value === 'string' ? +value : value as number;
        if (!numericFields[field]) {
          numericFields[field] = { min: numValue, max: numValue };
        } else {
          numericFields[field].min = Math.min(numericFields[field].min, numValue);
          numericFields[field].max = Math.max(numericFields[field].max, numValue);
        }
      }
    }
    
    // Then check all other fields
    Object.entries(feature.properties).forEach(([key, value]) => {
      if (!priorityFields.includes(key) && 
          (typeof value === 'number' || (typeof value === 'string' && !isNaN(+value)))) {
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
  
  // Add category to metadata
  if (category) {
    geoJSON.metadata.category = category;
  }
};

// Simplify GeoJSON to fit in localStorage
export const simplifyGeoJSON = (geoJSON: any): any => {
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

// Simplify geometry by reducing points
export const simplifyGeometry = (geometry: GeometryWithType | null): GeometryWithType | null => {
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
export const reducePoints = (points: any[], nth: number): any[] => {
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
