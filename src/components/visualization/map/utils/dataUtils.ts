
// Find a numeric value in properties for choropleth mapping
export const findValueInProperties = (properties: any) => {
  if (!properties) return null;
  
  // Look for common value fields, prioritizing electricity-related fields
  const valueFields = [
    // Electricity specific fields prioritized first
    'electricity', 'power', 'consumption', 'energy', 'usage', 'kwh', 'mwh', 'watts',
    // Then more generic fields
    'value', 'data', 'count', 'density', 'population', 'amount', 'total'
  ];
  
  for (const field of valueFields) {
    if (properties[field] !== undefined && !isNaN(parseFloat(properties[field]))) {
      return parseFloat(properties[field]);
    }
  }
  
  // Try to find any numeric property
  for (const key in properties) {
    if (properties[key] !== undefined && !isNaN(parseFloat(properties[key]))) {
      return parseFloat(properties[key]);
    }
  }
  
  return null;
};

// Helper function to find field by possible names
export const findFieldByName = (obj: any, possibleNames: string[]) => {
  if (!obj) return null;
  
  for (const name of possibleNames) {
    if (obj.hasOwnProperty(name)) return name;
  }
  
  return null;
};

// Helper function to find geographic points in data
export const findGeoPoints = (data: any[]) => {
  if (!data || data.length === 0) return { validPoints: [] };
  
  const validPoints: { 
    lat: number; 
    lng: number; 
    name?: string; 
    value?: number; 
    timeIndex?: number;
  }[] = [];
  const latField = findFieldByName(data[0], ['lat', 'latitude', 'y']);
  const lngField = findFieldByName(data[0], ['lng', 'longitude', 'lon', 'x']);
  const timeField = findFieldByName(data[0], ['year', 'date', 'time', 'period', 'timeIndex']);
  
  if (latField && lngField) {
    const timeValues: (string | number)[] = [];
    if (timeField) {
      // Collect all unique time values
      const uniqueTimeValues = new Set(data
        .map(item => item[timeField])
        .filter(Boolean));
      timeValues.push(...uniqueTimeValues);
    }
    
    data.forEach(item => {
      const lat = parseFloat(item[latField]);
      const lng = parseFloat(item[lngField]);
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const nameField = findFieldByName(item, ['name', 'title', 'label', 'country', 'region']);
        const valueField = findFieldByName(item, ['value', 'data', 'count', 'consumption', 'electricity', 'power', 'energy']);
        
        const point: {
          lat: number;
          lng: number;
          name?: string;
          value?: number;
          timeIndex?: number;
        } = { lat, lng };
        
        if (nameField) point.name = item[nameField];
        if (valueField) point.value = parseFloat(item[valueField]);
        
        // Add time index if available
        if (timeField) {
          const timeValue = item[timeField];
          if (timeValue !== undefined && timeValue !== null) {
            const timeIndex = timeValues.indexOf(timeValue);
            if (timeIndex !== -1) {
              point.timeIndex = timeIndex;
            }
          }
        }
        
        validPoints.push(point);
      }
    });
  }
  
  return { validPoints, latField, lngField, timeField };
};
