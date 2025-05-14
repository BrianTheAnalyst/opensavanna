
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
  
  // Enhanced field detection - check for more possible coordinate field names
  const latFieldNames = ['lat', 'latitude', 'y', 'LAT', 'LATITUDE', 'Latitude', 'Y'];
  const lngFieldNames = ['lng', 'longitude', 'lon', 'long', 'x', 'LNG', 'LONGITUDE', 'LON', 'LONG', 'Longitude', 'X'];
  const timeFieldNames = ['year', 'date', 'time', 'period', 'timeIndex', 'YEAR', 'DATE', 'TIME'];
  
  const latField = findFieldByName(data[0], latFieldNames);
  const lngField = findFieldByName(data[0], lngFieldNames);
  const timeField = findFieldByName(data[0], timeFieldNames);
  
  // If we have coordinate fields, extract points
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
        // Look for name and value fields with broader detection
        const nameFieldNames = ['name', 'title', 'label', 'country', 'region', 'city', 'location', 'place'];
        const valueFieldNames = ['value', 'data', 'count', 'consumption', 'electricity', 'power', 'energy', 'amount'];
        
        const nameField = findFieldByName(item, nameFieldNames);
        const valueField = findFieldByName(item, valueFieldNames);
        
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
  // Check for embedded coordinates in other formats (GeoJSON, etc.)
  else if (data.some(item => item.geometry && item.geometry.coordinates)) {
    data.forEach(item => {
      if (item.geometry && item.geometry.coordinates && Array.isArray(item.geometry.coordinates)) {
        const coords = item.geometry.coordinates;
        
        // Handle GeoJSON coordinate format [lng, lat]
        if (coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
          const lng = coords[0];
          const lat = coords[1];
          
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const point: {
              lat: number;
              lng: number;
              name?: string;
              value?: number;
            } = { lat, lng };
            
            // Extract properties
            if (item.properties) {
              if (item.properties.name) point.name = item.properties.name;
              
              // Find a value in properties
              const value = findValueInProperties(item.properties);
              if (value !== null) point.value = value;
            }
            
            validPoints.push(point);
          }
        }
      }
    });
  }
  
  return { validPoints, latField, lngField, timeField };
};

// New utility function to calculate bounds from a collection of points
export const calculateBoundsFromPoints = (points: Array<{lat: number, lng: number}>) => {
  if (!points || points.length === 0) return null;
  
  let north = -90, south = 90, east = -180, west = 180;
  
  points.forEach(point => {
    north = Math.max(north, point.lat);
    south = Math.min(south, point.lat);
    east = Math.max(east, point.lng);
    west = Math.min(west, point.lng);
  });
  
  return { north, south, east, west };
};
