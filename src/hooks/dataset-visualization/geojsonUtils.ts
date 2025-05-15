
/**
 * Create a simplified GeoJSON for datasets that don't have proper GeoJSON
 */
export const createSimplifiedGeoJSON = (data: any[], category: string) => {
  if (!data || data.length === 0) return null;
  
  // Look for location data in the dataset
  const hasLocationData = data.some(item => 
    (item.country || item.region || item.city || item.location) && 
    (typeof item.value === 'number' || typeof item.consumption === 'number' || 
     typeof item.electricity === 'number' || typeof item.power === 'number')
  );
  
  if (!hasLocationData) return null;
  
  // Create a simplified GeoJSON structure
  const features = data.map(item => {
    // Find a value to use
    const value = item.value || item.consumption || item.electricity || item.power || 1;
    
    // Find a location to use
    const location = item.country || item.region || item.city || item.location || 'Unknown';
    
    return {
      type: "Feature",
      properties: {
        name: location,
        value: value,
        ...item // Include all original properties
      },
      geometry: {
        type: "Point",
        coordinates: [
          // Use dummy coordinates since we don't have real ones
          // These will be displayed in a non-geographic representation
          Math.random() * 360 - 180, // -180 to 180 longitude
          Math.random() * 170 - 85   // -85 to 85 latitude (avoid poles)
        ]
      }
    };
  });
  
  return {
    type: "FeatureCollection",
    features: features,
    metadata: {
      category: category,
      numericFields: {
        value: {
          min: Math.min(...features.map(f => f.properties.value)),
          max: Math.max(...features.map(f => f.properties.value))
        }
      }
    }
  };
};
