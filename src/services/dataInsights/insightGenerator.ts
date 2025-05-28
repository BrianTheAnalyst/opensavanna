
import { generateDataDrivenInsights } from './enhancedInsightGenerator';

export interface GenerateInsightsOptions {
  includeRecommendations?: boolean;
  maxInsights?: number;
  focusAreas?: string[];
}

// Main insight generation function
export const generateInsights = (
  data: any[], 
  category: string, 
  query: string = '',
  options: GenerateInsightsOptions = {}
): string[] => {
  const { maxInsights = 5 } = options;
  
  if (!data || data.length === 0) {
    return ['No data available for generating insights.'];
  }

  try {
    // Use the enhanced insight generator
    const insights = generateDataDrivenInsights(data, category, query, '');
    return insights.slice(0, maxInsights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return ['Unable to generate insights from the current data.'];
  }
};

// Pattern detection function
export const detectPatterns = (data: any[], category: string): string[] => {
  if (!data || data.length === 0) return [];
  
  const patterns: string[] = [];
  
  try {
    // Trend detection
    if (data.length >= 3) {
      const values = data.map(item => item.value || 0);
      const isIncreasing = values.every((val, i) => i === 0 || val >= values[i - 1]);
      const isDecreasing = values.every((val, i) => i === 0 || val <= values[i - 1]);
      
      if (isIncreasing) {
        patterns.push('Consistent upward trend detected across the dataset.');
      } else if (isDecreasing) {
        patterns.push('Consistent downward trend detected across the dataset.');
      }
    }
    
    // Outlier detection
    const values = data.map(item => item.value || 0);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    const outliers = data.filter(item => Math.abs(item.value - mean) > 2 * stdDev);
    if (outliers.length > 0) {
      patterns.push(`${outliers.length} outlier(s) detected that deviate significantly from the average.`);
    }
    
  } catch (error) {
    console.error('Error detecting patterns:', error);
  }
  
  return patterns;
};

// Keyword extraction function
export const extractKeywords = (text: string, maxKeywords: number = 5): string[] => {
  if (!text || typeof text !== 'string') return [];
  
  try {
    // Simple keyword extraction based on word frequency
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter out short words
    
    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
      
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return [];
  }
};

// Enhanced pattern detection with more sophisticated algorithms
export const detectAdvancedPatterns = (data: any[], category: string): string[] => {
  const patterns = detectPatterns(data, category);
  
  // Add seasonal pattern detection for time series
  if (data.length >= 12) {
    const seasonalPatterns = detectSeasonalPatterns(data);
    patterns.push(...seasonalPatterns);
  }
  
  return patterns;
};

// Helper function for seasonal pattern detection
const detectSeasonalPatterns = (data: any[]): string[] => {
  const patterns: string[] = [];
  
  try {
    // Simple seasonal detection - look for repeating patterns
    const values = data.map(item => item.value || 0);
    const quarterlyAverages: number[] = [];
    
    for (let i = 0; i < Math.floor(values.length / 4); i++) {
      const quarter = values.slice(i * 4, (i + 1) * 4);
      quarterlyAverages.push(quarter.reduce((sum, val) => sum + val, 0) / quarter.length);
    }
    
    if (quarterlyAverages.length >= 2) {
      const variance = quarterlyAverages.reduce((sum, val, i) => {
        const avg = quarterlyAverages.reduce((s, v) => s + v, 0) / quarterlyAverages.length;
        return sum + Math.pow(val - avg, 2);
      }, 0) / quarterlyAverages.length;
      
      if (variance > 0.1) {
        patterns.push('Seasonal variation detected in the data with recurring quarterly patterns.');
      }
    }
  } catch (error) {
    console.error('Error detecting seasonal patterns:', error);
  }
  
  return patterns;
};
