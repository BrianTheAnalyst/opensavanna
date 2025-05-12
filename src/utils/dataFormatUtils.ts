
// Helper functions for parsing and formatting data for visualization

// Format data points in a human-readable way
export const formatDataPoints = (dataPoints: number | string): string => {
  // Convert to number if it's a string
  const count = typeof dataPoints === 'string' ? parseInt(dataPoints, 10) : dataPoints;
  
  // If conversion failed or not a number, return the original
  if (isNaN(count)) return `${dataPoints}`;
  
  // Format large numbers with commas or abbreviate with K/M/B
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B`;
  } else if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toLocaleString();
  }
};

// Helper function to parse CSV data
export const parseCSVData = (csvText: string, category: string): any[] => {
  // Basic CSV parsing - for production use a robust CSV parser library
  const lines = csvText.split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Convert CSV to array of objects
  const parsedData = lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      // Try to convert numerical values
      const value = values[index];
      obj[header] = !isNaN(Number(value)) ? Number(value) : value;
    });
    return obj;
  });
  
  // Format data for visualization
  return formatDataForVisualization(parsedData, category);
};

// Format JSON data for visualization
export const formatJSONForVisualization = (jsonData: any, category: string): any[] => {
  // Handle both array and object formats
  const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  return formatDataForVisualization(dataArray, category);
};

// Format GeoJSON data for visualization
export const formatGeoJSONForVisualization = (geoJson: any, category: string): any[] => {
  if (!geoJson.features || !Array.isArray(geoJson.features)) {
    return [];
  }
  
  // Extract properties from features for visualization
  const data = geoJson.features.map((feature: any) => {
    // Start with all properties
    const item = { ...feature.properties };
    
    // Add geometry type
    if (feature.geometry) {
      item.geometry_type = feature.geometry.type;
      
      // For points, extract coordinates for easy plotting
      if (feature.geometry.type === 'Point' && Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length >= 2) {
        item.longitude = feature.geometry.coordinates[0];
        item.latitude = feature.geometry.coordinates[1];
      }
    }
    
    return item;
  });
  
  return formatDataForVisualization(data, category);
};

// Common function to format data for visualization
export const formatDataForVisualization = (data: any[], category: string): any[] => {
  // Extract key fields based on category
  if (data.length === 0) return [];
  
  // First, find the numeric field to use for values
  const numericFields = Object.keys(data[0])
    .filter(key => typeof data[0][key] === 'number')
    .sort();
  
  // Then, find a good candidate for the name field
  const nameFieldCandidates = Object.keys(data[0])
    .filter(key => typeof data[0][key] === 'string' && 
      !key.toLowerCase().includes('lat') && 
      !key.toLowerCase().includes('lon') &&
      !key.toLowerCase().includes('geometry'))
    .sort();
  
  // If we have no numeric fields, we can't create a visualization
  if (numericFields.length === 0) return [];
  
  // Choose appropriate fields based on category and available data
  let valueField = numericFields[0] || 'value';
  let nameField = nameFieldCandidates[0] || 'index';
  
  // For geographic data, try to find better field names
  if (category.toLowerCase().includes('geo') || 
      data.some(item => item.hasOwnProperty('latitude') || item.hasOwnProperty('lat'))) {
    
    // For geo data, prefer population, density or area metrics
    const geoValueFields = ['population', 'density', 'area', 'count', 'value'];
    for (const field of geoValueFields) {
      const match = numericFields.find(f => f.toLowerCase().includes(field));
      if (match) {
        valueField = match;
        break;
      }
    }
    
    // For geo data, prefer name, region, country for labels
    const geoNameFields = ['name', 'region', 'country', 'state', 'province', 'city', 'district', 'county'];
    for (const field of geoNameFields) {
      const match = nameFieldCandidates.find(f => f.toLowerCase().includes(field));
      if (match) {
        nameField = match;
        break;
      }
    }
  }
  
  // Format the data for visualization, limiting to 20 items
  return data.slice(0, 20).map((item, index) => {
    // Base object with name and value
    const visItem = {
      name: nameField !== 'index' ? String(item[nameField] || 'Item ' + index) : 'Item ' + index,
      value: Number(item[valueField] || 0),
      // Include original data for reference
      rawData: { ...item }
    };
    
    // If there is geo data, include it
    if ((item.latitude !== undefined && item.longitude !== undefined) || 
        (item.lat !== undefined && (item.lng !== undefined || item.lon !== undefined))) {
      visItem.lat = item.latitude || item.lat;
      visItem.lng = item.longitude || item.lng || item.lon;
    }
    
    return visItem;
  });
};
