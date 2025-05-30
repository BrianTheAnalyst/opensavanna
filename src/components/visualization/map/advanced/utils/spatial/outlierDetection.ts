
import { MapPoint } from '../../types';

/**
 * Detect spatial outliers
 */
export const detectSpatialOutliers = (points: MapPoint[], weights: number[][]): MapPoint[] => {
  const n = points.length;
  const values = points.map(p => p.value);
  const outliers: MapPoint[] = [];
  
  for (let i = 0; i < n; i++) {
    // Calculate local neighborhood statistics
    let neighborSum = 0;
    let neighborCount = 0;
    
    for (let j = 0; j < n; j++) {
      if (i !== j && weights[i][j] > 0) {
        neighborSum += values[j];
        neighborCount++;
      }
    }
    
    if (neighborCount > 0) {
      const neighborMean = neighborSum / neighborCount;
      const difference = Math.abs(values[i] - neighborMean);
      const threshold = 2 * Math.sqrt(neighborSum / neighborCount); // Simplified threshold
      
      if (difference > threshold) {
        outliers.push({
          ...points[i],
          isAnomaly: true,
          spatialDeviation: difference
        });
      }
    }
  }
  
  return outliers;
};
