import { PathOptions } from 'leaflet';

// Style function for GeoJSON
export const styleFeature = (feature: any, visualizationType: string = 'standard', category?: string): PathOptions => {
  // Default colors for standard maps
  const baseStyle: PathOptions = {
    weight: 1,
    opacity: 0.8,
    color: '#6366F1',
    fillOpacity: 0.5,
    fillColor: '#818CF8'
  };

  // If not using choropleth, return the standard style
  if (visualizationType !== 'choropleth') {
    return baseStyle;
  }
  
  // For choropleth maps, determine color based on value
  if (feature.properties) {
    const value = findValueInProperties(feature.properties);
    if (value !== null) {
      const colorScale = getColorScaleForCategory(category);
      const normalizedValue = getNormalizedValue(value, feature, colorScale.length);
      
      return {
        ...baseStyle,
        weight: 1,
        color: '#fff',
        opacity: 0.5,
        fillColor: colorScale[normalizedValue],
        fillOpacity: 0.8
      };
    }
  }
  
  return baseStyle;
};

// Get a color scale based on data category
export const getColorScaleForCategory = (category?: string): string[] => {
  // Color scales optimized for different data types
  const scales: Record<string, string[]> = {
    energy: ['#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'],
    electricity: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'], // Added specific scale for electricity
    power: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'], // Similar to electricity
    health: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
    economics: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'],
    environment: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    default: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']
  };

  // Find the most appropriate color scale
  let key = 'default';
  if (category) {
    const lowerCategory = category.toLowerCase();
    for (const scaleKey of Object.keys(scales)) {
      if (lowerCategory.includes(scaleKey)) {
        key = scaleKey;
        break;
      }
    }
  }

  return scales[key];
};

// Get normalized value index for color scale
const getNormalizedValue = (value: number, feature: any, numColors: number): number => {
  // Try to find min/max values in the feature collection if available
  const collection = feature?.parent;
  
  if (collection && collection.features && collection.features.length > 0) {
    const values = collection.features
      .map((f: any) => findValueInProperties(f.properties))
      .filter((v: number | null) => v !== null) as number[];
    
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (min !== max) {
        const normalized = Math.floor(((value - min) / (max - min)) * (numColors - 1));
        return Math.max(0, Math.min(normalized, numColors - 1));
      }
    }
  }
  
  // Fallback to simple value-based bucketing
  // Scale value to a number between 0 and numColors-1
  if (value > 1000) return numColors - 1;
  if (value > 500) return Math.floor(numColors * 0.8);
  if (value > 100) return Math.floor(numColors * 0.6);
  if (value > 50) return Math.floor(numColors * 0.4);
  if (value > 10) return Math.floor(numColors * 0.2);
  return 0;
};

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

// Function for handling GeoJSON feature interactions
export const onEachFeature = (feature: any, layer: any) => {
  if (feature.properties) {
    // Store reference to the feature collection for min/max calculations
    if (feature && layer._source && layer._source.features) {
      feature.parent = layer._source;
    }
    
    // Format properties for popup
    const popupContent = formatPropertiesForDisplay(feature.properties);
    layer.bindPopup(popupContent);
    
    // Add hover effect
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#fff',
          dashArray: '',
          fillOpacity: 0.7
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: '#fff',
          dashArray: '',
          fillOpacity: 0.5
        });
      }
    });
  }
};

// Format properties for display in popup
const formatPropertiesForDisplay = (properties: Record<string, any>): string => {
  if (!properties) return 'No data available';
  
  // Skip internal properties and prioritize important ones
  const skipProperties = ['id', 'gid', 'fid', 'objectid', 'shape_area', 'shape_length'];
  const priorityProperties = ['name', 'country', 'region', 'state', 'electricity', 'power', 'consumption', 'energy', 'value'];
  
  let html = '<div class="map-popup">';
  
  // First add the name/title if it exists
  if (properties.name) {
    html += `<h4 class="text-sm font-medium mb-1">${properties.name}</h4>`;
  } else if (properties.title) {
    html += `<h4 class="text-sm font-medium mb-1">${properties.title}</h4>`;
  }
  
  // Add priority properties first
  for (const key of priorityProperties) {
    if (properties[key] !== undefined && !skipProperties.includes(key.toLowerCase())) {
      const formattedValue = formatPropertyValue(properties[key]);
      const formattedKey = formatPropertyKey(key);
      html += `<div class="flex text-xs"><span class="font-medium mr-1">${formattedKey}:</span> ${formattedValue}</div>`;
    }
  }
  
  // Add other properties
  for (const key in properties) {
    if (!priorityProperties.includes(key) && !skipProperties.includes(key.toLowerCase()) && properties[key] !== undefined) {
      const formattedValue = formatPropertyValue(properties[key]);
      const formattedKey = formatPropertyKey(key);
      html += `<div class="flex text-xs"><span class="font-medium mr-1">${formattedKey}:</span> ${formattedValue}</div>`;
    }
  }
  
  html += '</div>';
  return html;
};

// Format property keys for display (convert snake_case or camelCase to Title Case)
const formatPropertyKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

// Format property values for display
const formatPropertyValue = (value: any): string => {
  if (typeof value === 'number') {
    if (value % 1 !== 0) {
      return value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    return value.toLocaleString();
  }
  return String(value);
};

// Calculate bounds from GeoJSON
export const calculateBounds = (geoJSON: any) => {
  if (!geoJSON || !geoJSON.features || !geoJSON.features.length) return null;
  
  let north = -90, south = 90, east = -180, west = 180;
  let hasValidCoordinates = false;
  
  // Process all features
  geoJSON.features.forEach((feature: any) => {
    if (!feature.geometry || !feature.geometry.coordinates) return;
    
    const processCoordinate = (coord: number[]) => {
      if (coord.length < 2) return;
      const lng = coord[0];
      const lat = coord[1];
      
      if (isFinite(lat) && isFinite(lng)) {
        north = Math.max(north, lat);
        south = Math.min(south, lat);
        east = Math.max(east, lng);
        west = Math.min(west, lng);
        hasValidCoordinates = true;
      }
    };
    
    const processCoordinatesArray = (coords: any[], depth = 0) => {
      if (coords.length === 0) return;
      
      if (depth > 0 && typeof coords[0] === 'number') {
        processCoordinate(coords);
      } else {
        coords.forEach(coord => processCoordinatesArray(coord, depth + 1));
      }
    };
    
    processCoordinatesArray(feature.geometry.coordinates);
  });
  
  return hasValidCoordinates ? { north, south, east, west } : null;
};

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
      timeValues.push(...new Set(data.map(item => item[timeField]).filter(Boolean)));
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

// Helper function to find a field by possible names
export const findFieldByName = (obj: any, possibleNames: string[]) => {
  if (!obj) return null;
  
  for (const name of possibleNames) {
    if (obj.hasOwnProperty(name)) return name;
  }
  
  return null;
};
