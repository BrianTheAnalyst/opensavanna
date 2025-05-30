
import { MapPoint } from '../../types';

/**
 * Identify hotspots and coldspots using Local Moran's I
 */
export const identifyHotspots = (points: MapPoint[], weights: number[][]) => {
  const n = points.length;
  const values = points.map(p => p.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;
  
  const hotspots: MapPoint[] = [];
  const coldspots: MapPoint[] = [];
  
  for (let i = 0; i < n; i++) {
    const xi = values[i] - mean;
    let spatialLag = 0;
    
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        spatialLag += weights[i][j] * (values[j] - mean);
      }
    }
    
    const localI = (xi / variance) * spatialLag;
    
    // Threshold for significance (simplified)
    if (localI > 1.96) { // 95% confidence
      if (xi > 0 && spatialLag > 0) {
        hotspots.push({ ...points[i], localMoransI: localI });
      } else if (xi < 0 && spatialLag < 0) {
        coldspots.push({ ...points[i], localMoransI: localI });
      }
    }
  }
  
  return { hotspots, coldspots };
};
