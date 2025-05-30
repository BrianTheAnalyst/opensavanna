
import { MapPoint, SpatialAnalysisResult } from '../../types';
import { calculateSpatialWeights } from './spatialWeights';
import { calculateMoransI } from './moransI';
import { identifyHotspots } from './hotspotAnalysis';
import { detectSpatialOutliers } from './outlierDetection';
import { buildNeighborhoods } from './neighborhoods';

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

// Re-export individual functions for direct use
export { calculateSpatialWeights } from './spatialWeights';
export { calculateMoransI } from './moransI';
export { identifyHotspots } from './hotspotAnalysis';
export { detectSpatialOutliers } from './outlierDetection';
export { buildNeighborhoods } from './neighborhoods';
