
import { useEffect, useState } from 'react';
import { MapPoint } from '../types';
import { analyzeSpatialData } from '../utils/spatial';

interface UseSpatialAnalysisProps {
  points: MapPoint[];
  showInsights: boolean;
}

export const useSpatialAnalysis = ({ points, showInsights }: UseSpatialAnalysisProps) => {
  const [spatialAnalysis, setSpatialAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (points.length > 0 && showInsights) {
      setIsAnalyzing(true);
      analyzeSpatialData(points)
        .then(analysis => {
          setSpatialAnalysis(analysis);
          setIsAnalyzing(false);
        })
        .catch(error => {
          console.error('Spatial analysis failed:', error);
          setIsAnalyzing(false);
        });
    }
  }, [points, showInsights]);

  return { spatialAnalysis, isAnalyzing };
};
