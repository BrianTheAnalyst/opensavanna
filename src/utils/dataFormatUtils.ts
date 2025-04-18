
// Helper functions for parsing and formatting data for visualization

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
  const data = geoJson.features.map((feature: any) => ({
    ...feature.properties,
    geometry_type: feature.geometry?.type
  }));
  
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
    .filter(key => typeof data[0][key] === 'string')
    .sort();
  
  // If we have no numeric fields, we can't create a visualization
  if (numericFields.length === 0) return [];
  
  // Choose appropriate fields based on category and available data
  const valueField = numericFields[0] || 'value';  
  const nameField = nameFieldCandidates[0] || 'index';
  
  // Format the data for visualization, limiting to 20 items
  return data.slice(0, 20).map((item, index) => ({
    name: nameField !== 'index' ? String(item[nameField] || 'Item ' + index) : 'Item ' + index,
    value: Number(item[valueField] || 0),
    // Include original data for reference
    rawData: { ...item }
  }));
};
