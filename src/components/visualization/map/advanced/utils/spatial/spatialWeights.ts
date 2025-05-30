
import { MapPoint } from '../../types';

/**
 * Calculate spatial weights matrix using inverse distance
 */
export const calculateSpatialWeights = (points: MapPoint[]): number[][] => {
  const n = points.length;
  const weights: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const distance = haversineDistance(
          points[i].lat, points[i].lng,
          points[j].lat, points[j].lng
        );
        // Inverse distance weighting with cutoff
        weights[i][j] = distance < 100 ? 1 / (distance + 1) : 0;
      }
    }
    
    // Row standardize
    const rowSum = weights[i].reduce((sum, w) => sum + w, 0);
    if (rowSum > 0) {
      for (let j = 0; j < n; j++) {
        weights[i][j] /= rowSum;
      }
    }
  }
  
  return weights;
};

/**
 * Haversine distance calculation
 */
export const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
