
import { MapPoint } from '../../types';

/**
 * Build neighborhood structures
 */
export const buildNeighborhoods = (points: MapPoint[], weights: number[][]) => {
  return points.map((point, i) => {
    const neighbors = points.filter((_, j) => i !== j && weights[i][j] > 0);
    const avgValue = neighbors.length > 0 
      ? neighbors.reduce((sum, n) => sum + n.value, 0) / neighbors.length 
      : point.value;
    
    return {
      center: point,
      neighbors,
      avgValue
    };
  });
};
