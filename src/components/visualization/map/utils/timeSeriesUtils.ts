
// Extract time series data from GeoJSON
export const extractTimeSeriesData = (geoJSON: any) => {
  if (!geoJSON || !geoJSON.features || geoJSON.features.length === 0) return undefined;
  
  // Look for time-related properties in the first feature
  const timeProperties = ['year', 'month', 'date', 'time', 'period', 'timeIndex'];
  const firstFeature = geoJSON.features[0].properties || {};
  
  // Find a time property that contains an array or multiple time values
  for (const prop of timeProperties) {
    // Check if the property is an array
    if (Array.isArray(firstFeature[prop])) {
      // Ensure it's a string or number array
      const timeValues = firstFeature[prop].filter(
        (v): v is string | number => typeof v === 'string' || typeof v === 'number'
      );
      
      if (timeValues.length > 1) {
        return {
          property: prop,
          labels: timeValues.map(String),
          min: 0,
          max: timeValues.length - 1
        };
      }
    }
  }
  
  // Check if all features have a similar time property that we can use
  for (const prop of timeProperties) {
    const uniqueValues = [...new Set(
      geoJSON.features
        .map((f: any) => f.properties?.[prop])
        .filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
    )].sort();
    
    if (uniqueValues.length > 1) {
      return {
        property: prop,
        labels: uniqueValues.map(String),
        min: 0,
        max: uniqueValues.length - 1
      };
    }
  }
  
  return undefined;
};
