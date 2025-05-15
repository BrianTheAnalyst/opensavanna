
// Re-export all map utilities from the utils directory
export { calculateBounds } from './utils/geometryUtils';
export { extractTimeSeriesData } from './utils/timeSeriesUtils';

// Find geographic points in data
export const findGeoPoints = (data: any[]) => {
  if (!data || !Array.isArray(data)) {
    return { validPoints: [] };
  }

  const validPoints: Array<{ lat: number; lng: number; name?: string; value?: number }> = [];

  data.forEach(item => {
    let lat: number | undefined;
    let lng: number | undefined;
    
    // Check for lat/lng properties
    if (typeof item.lat === 'number' && typeof item.lng === 'number') {
      lat = item.lat;
      lng = item.lng;
    }
    // Check for latitude/longitude properties
    else if (typeof item.latitude === 'number' && typeof item.longitude === 'number') {
      lat = item.latitude;
      lng = item.longitude;
    }
    
    // If we have valid coordinates, add to points
    if (typeof lat === 'number' && typeof lng === 'number' && 
        !isNaN(lat) && !isNaN(lng) && 
        lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      
      validPoints.push({
        lat,
        lng,
        name: item.name || item.title || '',
        value: typeof item.value === 'number' ? item.value : 
               typeof item.data === 'number' ? item.data : 1
      });
    }
  });

  return { validPoints };
};
