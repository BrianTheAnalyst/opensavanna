
import { LatLngExpression } from 'leaflet';

// Calculate appropriate zoom level based on geographic span
export function calculateZoomLevel(bounds: { 
  north: number; 
  south: number; 
  east: number; 
  west: number; 
}): number {
  const latSpan = Math.abs(bounds.north - bounds.south);
  const lngSpan = Math.abs(bounds.east - bounds.west);
  const span = Math.max(latSpan, lngSpan);
  
  if (span < 1) return 10;
  else if (span < 5) return 7;
  else if (span < 20) return 5;
  else return 3;
}

// Calculate map center from bounds
export function calculateMapCenter(bounds: { 
  north: number; 
  south: number; 
  east: number; 
  west: number; 
}): LatLngExpression {
  return [(bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2];
}
