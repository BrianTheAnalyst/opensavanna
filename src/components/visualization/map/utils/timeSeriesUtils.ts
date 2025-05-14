
// Extract time series data from GeoJSON
export const extractTimeSeriesData = (geoJSON: any) => {
  if (!geoJSON || !geoJSON.features || !geoJSON.features.length) return undefined;
  
  // Look for time-related properties in features
  const timeProperties = ['year', 'date', 'time', 'period', 'timeIndex'];
  let timeField: string | null = null;
  let timeSeries: (string | number)[] = [];
  
  // Find the first time property that exists in the features
  for (const prop of timeProperties) {
    const timeValues = geoJSON.features
      .map((feature: any) => feature.properties?.[prop])
      .filter((val: any) => val !== undefined && val !== null);
    
    if (timeValues.length > 0) {
      timeField = prop;
      // Get unique time values
      timeSeries = [...new Set(timeValues)].sort();
      break;
    }
  }
  
  // Check if metadata has time information
  if (!timeField && geoJSON.metadata?.timeSeries) {
    return {
      labels: geoJSON.metadata.timeSeries.labels || [],
      min: 0,
      max: (geoJSON.metadata.timeSeries.labels?.length || 1) - 1
    };
  }
  
  // If we found time data
  if (timeField && timeSeries.length > 1) {
    return {
      labels: timeSeries.map(t => String(t)),
      min: 0,
      max: timeSeries.length - 1
    };
  }
  
  return undefined;
};
