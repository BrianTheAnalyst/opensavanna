
/**
 * LocalStorage utilities for GeoJSON data
 */

// Store GeoJSON in localStorage with simplification if needed
export function storeInLocalStorage(datasetId: string, geoJSON: any, attemptSimplification = true): boolean {
  try {
    const jsonString = JSON.stringify(geoJSON);
    
    // If the string is too large for localStorage, try to simplify it
    if (jsonString.length > 5000000 && attemptSimplification) { // ~5MB
      // Create a more simplified version
      const simplifiedGeoJSON = simplifyGeoJSONForStorage(geoJSON);
      localStorage.setItem(`geojson_${datasetId}`, JSON.stringify(simplifiedGeoJSON));
    } else {
      localStorage.setItem(`geojson_${datasetId}`, jsonString);
    }
    
    return true;
  } catch (err) {
    console.error('Failed to store GeoJSON in localStorage:', err);
    return false;
  }
}

// Retrieve GeoJSON from localStorage
export function getFromLocalStorage(datasetId: string): any | null {
  try {
    const storedGeoJSON = localStorage.getItem(`geojson_${datasetId}`);
    return storedGeoJSON ? JSON.parse(storedGeoJSON) : null;
  } catch (localErr) {
    console.warn('Failed to retrieve from localStorage:', localErr);
    return null;
  }
}

// Create simplified GeoJSON for localStorage
function simplifyGeoJSONForStorage(geoJSON: any): any {
  return {
    ...geoJSON,
    features: geoJSON.features?.slice(0, 100).map((feature: any) => ({
      type: feature.type,
      properties: feature.properties,
      geometry: feature.geometry ? {
        type: feature.geometry.type,
        coordinates: simplifyCoordinates(feature.geometry)
      } : null
    }))
  };
}

// Helper function to simplify coordinates
function simplifyCoordinates(geometry: any): any {
  if (!geometry || !geometry.coordinates) return geometry?.coordinates;
  
  const { type, coordinates } = geometry;
  
  switch (type) {
    case 'Point':
      return coordinates;
      
    case 'LineString':
      return coordinates.filter((_: any, i: number) => i % 5 === 0 || i === coordinates.length - 1);
      
    case 'Polygon':
      return coordinates.map((ring: any[]) => 
        ring.filter((_: any, i: number) => i % 5 === 0 || i === ring.length - 1)
      );
      
    case 'MultiPoint':
      return coordinates.filter((_: any, i: number) => i % 5 === 0 || i === coordinates.length - 1);
      
    case 'MultiLineString':
      return coordinates.map((line: any[]) => 
        line.filter((_: any, i: number) => i % 5 === 0 || i === line.length - 1)
      );
      
    case 'MultiPolygon':
      return coordinates.map((polygon: any[]) => 
        polygon.map((ring: any[]) => 
          ring.filter((_: any, i: number) => i % 5 === 0 || i === ring.length - 1)
        )
      );
      
    default:
      return coordinates;
  }
}
