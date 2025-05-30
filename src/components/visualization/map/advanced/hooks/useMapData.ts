
import { useMemo } from 'react';
import { MapPoint, DataPattern } from '../types';
import { detectDataPatterns } from '../utils/patternDetection';

interface UseMapDataProps {
  data: any[];
  category: string;
}

interface UseMapDataReturn {
  points: MapPoint[];
  insights: string[];
  patterns: DataPattern;
}

export const useMapData = ({ data, category }: UseMapDataProps): UseMapDataReturn => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        points: [],
        insights: [],
        patterns: { clusters: [], outliers: [], hasTemporalData: false, correlations: [] }
      };
    }
    
    // Convert data to standardized map points
    const points: MapPoint[] = data.map((item, index) => ({
      id: `point-${index}`,
      lat: item.lat || item.latitude || 0,
      lng: item.lng || item.longitude || 0,
      value: item.value || item.data || Math.random() * 100,
      properties: {
        name: item.name || `Location ${index + 1}`,
        category: item.category || category,
        ...item
      },
      timeIndex: item.timeIndex || item.year || 0
    })).filter(point => point.lat !== 0 && point.lng !== 0);
    
    // Detect patterns in the data
    const patterns = detectDataPatterns(points);
    
    // Generate insights based on patterns
    const insights = [
      `Analyzed ${points.length} geographic data points`,
      `Detected ${patterns.clusters.length} distinct spatial clusters`,
      `Found ${patterns.outliers.length} anomalous data points`,
      patterns.hasTemporalData 
        ? `Temporal data spans ${patterns.timeRange?.max - patterns.timeRange?.min} time periods`
        : 'Static geographic data',
      `Primary data concentration in ${patterns.dominantRegion || 'distributed pattern'}`
    ];
    
    return { points, insights, patterns };
  }, [data, category]);
};
