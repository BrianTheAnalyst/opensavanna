
// Extract time series information from GeoJSON
export function extractTimeSeriesInfo(geoJSON: any): { 
  hasTimeSeriesData: boolean; 
  timeLabels: string[] 
} {
  const defaultResult = { hasTimeSeriesData: false, timeLabels: [] };
  
  if (!geoJSON || !geoJSON.features || geoJSON.features.length === 0) {
    return defaultResult;
  }
  
  // Check for time properties in features
  const timeProperties = ['time', 'year', 'date', 'period', 'timeIndex'];
  
  for (const prop of timeProperties) {
    // Check if any features have time properties
    const timeValues = new Set();
    let foundTimeProp = false;
    
    for (const feature of geoJSON.features) {
      if (feature.properties && feature.properties[prop] !== undefined) {
        timeValues.add(feature.properties[prop]);
        foundTimeProp = true;
      }
    }
    
    if (foundTimeProp && timeValues.size > 1) {
      return {
        hasTimeSeriesData: true,
        timeLabels: Array.from(timeValues).map(v => String(v))
      };
    }
  }
  
  return defaultResult;
}
