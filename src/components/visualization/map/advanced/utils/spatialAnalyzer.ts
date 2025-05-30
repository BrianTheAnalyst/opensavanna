
import { MapPoint, SpatialAnalysisResult } from '../types';

/**
 * Performs comprehensive spatial analysis including Moran's I calculation
 */
export const analyzeSpatialData = async (points: MapPoint[]): Promise<SpatialAnalysisResult> => {
  if (points.length < 5) {
    throw new Error('Insufficient data points for spatial analysis');
  }

  // Calculate spatial weights matrix (based on distance)
  const weights = calculateSpatialWeights(points);
  
  // Calculate Moran's I
  const moransI = calculateMoransI(points, weights);
  
  // Identify hotspots and coldspots using Local Moran's I
  const { hotspots, coldspots } = identifyHotspots(points, weights);
  
  // Detect spatial outliers
  const outliers = detectSpatialOutliers(points, weights);
  
  // Build neighborhoods
  const neighborhoods = buildNeighborhoods(points, weights);
  
  // Determine clustering pattern
  const clustering = moransI.value > 0.3 ? 'clustered' : 
                    moransI.value < -0.3 ? 'dispersed' : 'random';

  return {
    moransI: moransI.value,
    pValue: moransI.pValue,
    zScore: moransI.zScore,
    clustering,
    hotspots,
    coldspots,
    outliers,
    neighborhoods
  };
};

/**
 * Calculate spatial weights matrix using inverse distance
 */
const calculateSpatialWeights = (points: MapPoint[]): number[][] => {
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
 * Calculate Global Moran's I statistic
 */
const calculateMoransI = (points: MapPoint[], weights: number[][]) => {
  const n = points.length;
  const values = points.map(p => p.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  
  // Calculate numerator and denominator
  let numerator = 0;
  let denominator = 0;
  let W = 0; // Sum of all weights
  
  for (let i = 0; i < n; i++) {
    const xi = values[i] - mean;
    denominator += xi * xi;
    
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const xj = values[j] - mean;
        numerator += weights[i][j] * xi * xj;
        W += weights[i][j];
      }
    }
  }
  
  const moransI = (n / W) * (numerator / denominator);
  
  // Calculate expected value and variance for significance testing
  const expectedI = -1 / (n - 1);
  const varianceI = calculateMoransIVariance(n, weights);
  const zScore = (moransI - expectedI) / Math.sqrt(varianceI);
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  return {
    value: moransI,
    expected: expectedI,
    variance: varianceI,
    zScore,
    pValue
  };
};

/**
 * Calculate variance of Moran's I for significance testing
 */
const calculateMoransIVariance = (n: number, weights: number[][]): number => {
  // Simplified variance calculation
  // In a full implementation, this would include more terms
  const W = weights.flat().reduce((sum, w) => sum + w, 0);
  return (n - 1) / (W * W);
};

/**
 * Identify hotspots and coldspots using Local Moran's I
 */
const identifyHotspots = (points: MapPoint[], weights: number[][]) => {
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

/**
 * Detect spatial outliers
 */
const detectSpatialOutliers = (points: MapPoint[], weights: number[][]): MapPoint[] => {
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

/**
 * Build neighborhood structures
 */
const buildNeighborhoods = (points: MapPoint[], weights: number[][]) => {
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

/**
 * Haversine distance calculation
 */
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Normal CDF approximation for p-value calculation
 */
const normalCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

/**
 * Error function approximation
 */
const erf = (x: number): number => {
  // Abramowitz and Stegun approximation
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
};
