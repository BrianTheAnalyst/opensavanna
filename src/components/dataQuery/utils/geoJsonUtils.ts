
import { DataInsightResult } from '@/services/dataInsightsService';

/**
 * Creates GeoJSON from point data if map visualization exists but no GeoJSON
 */
export const prepareGeoJSONForMap = (viz: any) => {
  if (viz.type !== 'map' || !viz.data || !Array.isArray(viz.data)) return null;
  
  // Check if any items have geographic properties
  const hasGeographicData = viz.data.some((item: any) => 
    (item.lat !== undefined && item.lng !== undefined) ||
    (item.latitude !== undefined && item.longitude !== undefined) ||
    (item.location !== undefined)
  );
  
  if (!hasGeographicData) return null;
  
  // Convert points to GeoJSON format
  const features = viz.data.map((item: any) => {
    // Get coordinates (prefer lat/lng, fallback to latitude/longitude)
    const lat = item.lat !== undefined ? item.lat : item.latitude;
    const lng = item.lng !== undefined ? item.lng : item.longitude;
    
    // Skip items without valid coordinates
    if (lat === undefined || lng === undefined) return null;
    
    // Get value for choropleth coloring
    const value = item.value !== undefined ? item.value : 
                 (item.data !== undefined ? item.data : 1);
    
    // Create a GeoJSON feature
    return {
      type: "Feature",
      properties: {
        name: item.name || item.title || "Location",
        value: value,
        ...item // Include all original properties
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat] // GeoJSON uses [longitude, latitude] order
      }
    };
  }).filter(Boolean); // Remove null entries
  
  // Only create GeoJSON if we have valid features
  if (!features || features.length === 0) return null;
  
  // Calculate min/max values for choropleth coloring
  const values = features
    .map((f: any) => f.properties.value)
    .filter((v: any) => typeof v === 'number');
  
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 100;
  
  return {
    type: "FeatureCollection",
    features: features,
    metadata: {
      category: viz.title || "Data Insights",
      numericFields: {
        value: { min, max }
      }
    }
  };
};
