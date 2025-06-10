import { DataInsightResult } from './types';

export interface QuestionCategory {
  type: 'analysis' | 'comparison' | 'trends' | 'geographic' | 'policy';
  icon: string;
  label: string;
  questions: string[];
}

// Generate categorized follow-up questions based on the query result
export const generateCategorizedFollowUpQuestions = (
  query: string, 
  result: DataInsightResult
): QuestionCategory[] => {
  const categories: QuestionCategory[] = [];
  
  // Extract key topics from the query and data
  const queryLower = query.toLowerCase();
  const topics = extractTopicsFromQuery(query);
  const hasMultipleDatasets = result.datasets.length > 1;
  const hasGeoData = result.visualizations.some(v => v.type === 'map');
  const datasetCategories = [...new Set(result.datasets.map(d => d.category.toLowerCase()))];
  
  // Analysis Questions
  const analysisQuestions: string[] = [];
  if (topics.length > 0) {
    analysisQuestions.push(`What factors are driving ${topics[0]} patterns?`);
    analysisQuestions.push(`What are the key indicators for ${topics[0]}?`);
  }
  if (result.insights.length > 0) {
    analysisQuestions.push("What deeper patterns exist in this data?");
  }
  
  if (analysisQuestions.length > 0) {
    categories.push({
      type: 'analysis',
      icon: '🔍',
      label: 'Deep Analysis',
      questions: analysisQuestions.slice(0, 2) // Limit to 2
    });
  }

  // Comparison Questions (only if multiple datasets or geographic data)
  if (hasMultipleDatasets || hasGeoData) {
    const comparisonQuestions: string[] = [];
    
    if (hasGeoData) {
      comparisonQuestions.push("How do different regions compare?");
      comparisonQuestions.push("Which areas show the strongest performance?");
    }
    
    if (hasMultipleDatasets && topics.length > 1) {
      comparisonQuestions.push(`How does ${topics[0]} relate to ${topics[1]}?`);
    }
    
    if (comparisonQuestions.length > 0) {
      categories.push({
        type: 'comparison',
        icon: '⚖️',
        label: 'Comparisons',
        questions: comparisonQuestions.slice(0, 2)
      });
    }
  }

  // Trend Questions
  const trendQuestions: string[] = [];
  if (topics.length > 0) {
    trendQuestions.push(`How has ${topics[0]} changed over time?`);
    trendQuestions.push(`What are the projected trends for ${topics[0]}?`);
  }
  
  if (trendQuestions.length > 0) {
    categories.push({
      type: 'trends',
      icon: '📈',
      label: 'Trends & Forecasts',
      questions: trendQuestions.slice(0, 2)
    });
  }

  // Geographic Questions (only if we have geographic data)
  if (hasGeoData) {
    const geoQuestions = [
      "What geographic patterns are most significant?",
      "Which locations need priority attention?"
    ];
    
    categories.push({
      type: 'geographic',
      icon: '🗺️',
      label: 'Geographic Insights',
      questions: geoQuestions
    });
  }

  // Policy Questions (context-specific)
  const policyQuestions: string[] = [];
  if (datasetCategories.includes('health')) {
    policyQuestions.push("What policy interventions could improve outcomes?");
  } else if (datasetCategories.includes('economics') || datasetCategories.includes('economy')) {
    policyQuestions.push("What economic policies would drive growth?");
  } else if (datasetCategories.includes('education')) {
    policyQuestions.push("How can education access be improved?");
  } else {
    policyQuestions.push("What policy recommendations emerge from this data?");
  }
  
  if (topics.length > 0) {
    policyQuestions.push(`What interventions could improve ${topics[0]}?`);
  }
  
  if (policyQuestions.length > 0) {
    categories.push({
      type: 'policy',
      icon: '🏛️',
      label: 'Policy Insights',
      questions: policyQuestions.slice(0, 2)
    });
  }

  // Return maximum of 4 categories to keep it clean
  return categories.slice(0, 4);
};

// Helper function to extract meaningful topics from query
const extractTopicsFromQuery = (query: string): string[] => {
  const stopWords = new Set([
    'what', 'where', 'when', 'which', 'show', 'tell', 'find', 'about', 
    'would', 'could', 'should', 'from', 'with', 'have', 'this', 'that',
    'they', 'them', 'these', 'those', 'are', 'is', 'was', 'were', 'be'
  ]);
  
  return query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 3); // Limit to 3 main topics
};
