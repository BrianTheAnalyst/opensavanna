
// Extract time series data from GeoJSON
export const extractTimeSeriesData = (geoJSON: any): { labels: string[], min: number, max: number } | undefined => {
  if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features) || geoJSON.features.length === 0) {
    return undefined;
  }

  // Check for time-related properties across features
  const timeFields = ['timeIndex', 'year', 'date', 'time', 'period'];
  let timeData: { field: string, values: (string | number)[] } | null = null;

  // Find the first time field with multiple values
  for (const field of timeFields) {
    // Extract all values for this field across features
    const values = geoJSON.features
      .filter(f => f.properties && f.properties[field] !== undefined)
      .map(f => f.properties[field]);

    // If we have values and they're unique, use this field
    if (values.length > 0) {
      const uniqueValues = [...new Set(values)].filter(Boolean).sort();
      if (uniqueValues.length > 1) {
        timeData = { field, values: uniqueValues };
        break;
      }
    }
  }

  // If no time data found, return undefined
  if (!timeData) {
    return undefined;
  }

  // Format labels depending on the data type
  const formatValue = (val: any): string => {
    if (typeof val === 'number') return String(val);
    if (typeof val === 'string') return val;
    return String(val);
  };

  const labels = timeData.values.map(formatValue);
  
  return {
    labels,
    min: 0,
    max: labels.length - 1
  };
};
