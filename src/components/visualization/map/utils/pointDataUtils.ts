
import { LatLngExpression } from 'leaflet';

// Calculate map center from point data
export function calculateCenterFromPoints(points: Array<{ lat: number; lng: number }>): LatLngExpression {
  if (!points || points.length === 0) {
    return [0, 0];
  }
  
  let sumLat = 0;
  let sumLng = 0;
  
  points.forEach(point => {
    sumLat += point.lat;
    sumLng += point.lng;
  });
  
  const avgLat = sumLat / points.length;
  const avgLng = sumLng / points.length;
  
  return [avgLat, avgLng];
}
