
import { MapPoint } from '../../types';

interface MoransIResult {
  value: number;
  expected: number;
  variance: number;
  zScore: number;
  pValue: number;
}

/**
 * Calculate Global Moran's I statistic
 */
export const calculateMoransI = (points: MapPoint[], weights: number[][]): MoransIResult => {
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
