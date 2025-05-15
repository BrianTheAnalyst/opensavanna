// This is a Web Worker for processing GeoJSON data
// It will run in a separate thread

// Define message types for type safety
interface ProcessGeoJSONMessage {
  type: 'PROCESS_GEOJSON';
  geoJSON: any;
  timeIndex?: number;
}

interface SimplifyGeoJSONMessage {
  type: 'SIMPLIFY_GEOJSON';
  geoJSON: any;
  simplificationFactor: number;
}

type WorkerMessage = ProcessGeoJSONMessage | SimplifyGeoJSONMessage;

// Process full GeoJSON - filtering by time index if needed
function processGeoJSON(geoJSON: any, timeIndex?: number) {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) return geoJSON;
  
  // Check if features have time properties
  const hasTemporal = geoJSON.features.some((feature: any) => 
    feature.properties && 
    (feature.properties.timeIndex !== undefined || 
     feature.properties.year !== undefined || 
     feature.properties.date !== undefined)
  );
  
  if (!hasTemporal || timeIndex === undefined) return geoJSON;
  
  // Filter features based on time
  const filteredFeatures = geoJSON.features.filter((feature: any) => {
    if (!feature.properties) return true;
    
    // Match by different possible time properties
    if (feature.properties.timeIndex !== undefined) {
      return feature.properties.timeIndex === timeIndex;
    }
    if (feature.properties.year !== undefined && Array.isArray(feature.properties.year)) {
      return feature.properties.year.includes(timeIndex);
    }
    if (feature.properties.date !== undefined && Array.isArray(feature.properties.date)) {
      return feature.properties.date.includes(timeIndex);
    }
    
    return true;
  });
  
  return {
    ...geoJSON,
    features: filteredFeatures
  };
}

// Simplify GeoJSON for faster rendering
function simplifyGeoJSON(geoJSON: any, simplificationFactor: number) {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) return geoJSON;
  
  // Take a subset of features based on simplificationFactor
  const featuresCount = geoJSON.features.length;
  const simplifiedCount = Math.max(1, Math.floor(featuresCount / simplificationFactor));
  const step = Math.max(1, Math.floor(featuresCount / simplifiedCount));
  
  // Create a simplified version with fewer features
  const simplifiedFeatures = [];
  for (let i = 0; i < featuresCount; i += step) {
    const feature = geoJSON.features[i];
    
    // Also simplify the geometry of each feature
    simplifiedFeatures.push({
      ...feature,
      geometry: simplifyGeometry(feature.geometry, simplificationFactor)
    });
  }
  
  return {
    ...geoJSON,
    features: simplifiedFeatures,
    simplified: true,
    simplificationFactor
  };
}

// Simplify geometry by reducing points
function simplifyGeometry(geometry: any, simplificationFactor: number) {
  if (!geometry) return geometry;
  
  // Create a new geometry object
  const simplifiedGeometry = {
    type: geometry.type,
    coordinates: undefined as any
  };
  
  // Simplify coordinates based on geometry type
  switch (geometry.type) {
    case 'Point':
      // Points don't need simplification
      simplifiedGeometry.coordinates = geometry.coordinates;
      break;
    
    case 'LineString':
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = reducePoints(geometry.coordinates, simplificationFactor);
      }
      break;
    
    case 'Polygon':
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.map((ring: any[]) => 
          reducePoints(ring, simplificationFactor)
        );
      }
      break;
    
    case 'MultiPoint':
      if (geometry.coordinates) {
        const count = geometry.coordinates.length;
        const step = Math.max(1, Math.floor(count / (count / simplificationFactor)));
        simplifiedGeometry.coordinates = [];
        for (let i = 0; i < count; i += step) {
          simplifiedGeometry.coordinates.push(geometry.coordinates[i]);
        }
      }
      break;
    
    case 'MultiLineString':
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.map((line: any[]) => 
          reducePoints(line, simplificationFactor)
        );
      }
      break;
    
    case 'MultiPolygon':
      if (geometry.coordinates) {
        simplifiedGeometry.coordinates = geometry.coordinates.map((polygon: any[]) => 
          polygon.map((ring: any[]) => reducePoints(ring, simplificationFactor))
        );
      }
      break;
    
    default:
      // For unsupported types, keep as is
      simplifiedGeometry.coordinates = geometry.coordinates;
  }
  
  return simplifiedGeometry;
}

// Take every nth point from an array of points
function reducePoints(points: any[], simplificationFactor: number): any[] {
  if (!points || points.length <= 2) return points;
  
  const step = Math.max(1, Math.floor(simplificationFactor));
  const result = [points[0]]; // Always include the first point
  
  for (let i = step; i < points.length - 1; i += step) {
    result.push(points[i]);
  }
  
  result.push(points[points.length - 1]); // Always include the last point
  
  return result;
}

// Set up message handler for worker
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  
  try {
    switch (message.type) {
      case 'PROCESS_GEOJSON':
        const processedData = processGeoJSON(message.geoJSON, message.timeIndex);
        self.postMessage({
          type: 'PROCESS_COMPLETE',
          processedGeoJSON: processedData
        });
        break;
        
      case 'SIMPLIFY_GEOJSON':
        const simplifiedData = simplifyGeoJSON(
          message.geoJSON, 
          message.simplificationFactor
        );
        self.postMessage({
          type: 'SIMPLIFY_COMPLETE',
          simplifiedGeoJSON: simplifiedData
        });
        break;
        
      default:
        self.postMessage({
          type: 'ERROR',
          error: 'Unknown message type'
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// TypeScript requires this for workers
export {};
