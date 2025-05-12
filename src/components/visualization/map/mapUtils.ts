
import { LatLngExpression } from 'leaflet';

// Style function for GeoJSON
export const styleFeature = (feature: any) => {
  // Default colors for choropleth maps
  const colors = [
    '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1',
    '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'
  ];
  
  // Default style
  const baseStyle = {
    weight: 1,
    opacity: 0.8,
    color: '#6366F1',
    fillOpacity: 0.5,
    fillColor: '#818CF8'
  };
  
  // If feature has properties with value, use it for choropleth coloring
  if (feature.properties) {
    const value = findValueInProperties(feature.properties);
    if (value !== null) {
      const colorIndex = Math.min(Math.floor(value * colors.length / 100), colors.length - 1);
      return {
        ...baseStyle,
        fillColor: colors[colorIndex]
      };
    }
  }
  
  return baseStyle;
};

// Find a numeric value in properties for choropleth mapping
export const findValueInProperties = (properties: any) => {
  if (!properties) return null;
  
  // Look for common value fields
  const valueFields = ['value', 'data', 'count', 'density', 'population'];
  
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
    const popupContent = Object.entries(feature.properties)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join('<br>');
    layer.bindPopup(popupContent);
  }
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

// Helper function to find geographic points in data
export const findGeoPoints = (data: any[]) => {
  if (!data || data.length === 0) return { validPoints: [] };
  
  const validPoints: { lat: number; lng: number; name?: string; value?: number }[] = [];
  const latField = findFieldByName(data[0], ['lat', 'latitude', 'y']);
  const lngField = findFieldByName(data[0], ['lng', 'longitude', 'lon', 'x']);
  
  if (latField && lngField) {
    data.forEach(item => {
      const lat = parseFloat(item[latField]);
      const lng = parseFloat(item[lngField]);
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const nameField = findFieldByName(item, ['name', 'title', 'label']);
        const valueField = findFieldByName(item, ['value', 'data', 'count']);
        
        validPoints.push({
          lat,
          lng,
          name: nameField ? item[nameField] : undefined,
          value: valueField ? parseFloat(item[valueField]) : undefined
        });
      }
    });
  }
  
  return { validPoints, latField, lngField };
};

// Helper function to find a field by possible names
export const findFieldByName = (obj: any, possibleNames: string[]) => {
  if (!obj) return null;
  
  for (const name of possibleNames) {
    if (obj.hasOwnProperty(name)) return name;
  }
  
  return null;
};
