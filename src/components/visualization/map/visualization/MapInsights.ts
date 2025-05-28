
import { useMemo } from 'react';
import { Insight } from './types';

export const useMapInsights = (category: string): Insight[] => {
  return useMemo(() => {
    const insights: Insight[] = [];
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('climate') || categoryLower.includes('environment')) {
      insights.push({
        id: '1',
        title: 'Temperature anomaly cluster',
        description: 'Detected unusual temperature pattern in the northwest region during summer months.',
        type: 'anomaly',
        confidence: 0.89,
        applied: false
      });
    } else if (categoryLower.includes('economic')) {
      insights.push({
        id: '1',
        title: 'Economic disparity cluster',
        description: 'Significant economic disparities detected between neighboring regions with similar resources.',
        type: 'anomaly',
        confidence: 0.78,
        applied: false
      });
    } else if (categoryLower.includes('health')) {
      insights.push({
        id: '1',
        title: 'Healthcare access gap',
        description: 'Substantial healthcare access disparities identified in adjacent administrative regions.',
        type: 'anomaly',
        confidence: 0.83,
        applied: false
      });
    }
    
    insights.push({
      id: '2',
      title: 'Strong correlation detected',
      description: `${category} metrics show significant correlation with population density patterns across regions.`,
      type: 'correlation',
      confidence: 0.76,
      applied: false
    });
    
    insights.push({
      id: '3',
      title: 'Seasonal variation pattern',
      description: `Eastern regions show consistent seasonal ${category.toLowerCase()} patterns with 15% variation from historical averages.`,
      type: 'temporal',
      confidence: 0.94,
      applied: false
    });
    
    return insights;
  }, [category]);
};
