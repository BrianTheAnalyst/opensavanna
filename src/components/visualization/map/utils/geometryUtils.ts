
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
        coords.forEach(coord => { processCoordinatesArray(coord, depth + 1); });
      }
    };
    
    processCoordinatesArray(feature.geometry.coordinates);
  });
  
  return hasValidCoordinates ? { north, south, east, west } : null;
};
