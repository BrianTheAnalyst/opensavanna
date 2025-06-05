
// Re-export all the main functions from the data insights modules
export { generateInsights, detectPatterns, extractKeywords } from './insightGenerator';
export { 
  transformDataForVisualization, 
  generateAxisLabels, 
  determineVisualizationType,
  generateComparison
} from './visualizationUtils';
export { generateDataDrivenInsights } from './enhancedInsightGenerator';
export { 
  generateVisualizationSummary, 
  generateDataRecommendations 
} from './dataSummaryService';
export { getSuggestedQuestions, generateFollowUpQuestions } from './suggestedQueries';

// Import the functions we need for the main service function
import { generateInsights, detectPatterns } from './insightGenerator';
import { generateVisualizationSummary, generateDataRecommendations } from './dataSummaryService';
import { generateFollowUpQuestions } from './suggestedQueries';

// Main service function that orchestrates all insights
export const generateCompleteDataInsights = async (
  data: any[], 
  category: string, 
  query: string = ''
) => {
  try {
    const insights = generateInsights(data, category, query, { maxInsights: 6 });
    const patterns = detectPatterns(data, category);
    const summary = generateVisualizationSummary(data, category, 'analysis');
    const recommendations = generateDataRecommendations(data, category);
    const followUpQuestions = generateFollowUpQuestions(query, category);
    
    return {
      insights,
      patterns,
      summary,
      recommendations,
      followUpQuestions,
      dataPoints: data.length,
      category
    };
  } catch (error) {
    console.error('Error generating complete insights:', error);
    return {
      insights: ['Unable to generate insights'],
      patterns: [],
      summary: 'Analysis unavailable',
      recommendations: [],
      followUpQuestions: [],
      dataPoints: 0,
      category
    };
  }
};
