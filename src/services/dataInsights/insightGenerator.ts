
import { extractKeywords } from './datasetFinder';
import { generateInsights } from '@/utils/datasetVisualizationUtils';
import { detectPatterns } from './patternDetection';

// Generate insights based on the visualizations
export const generateInsightsForQuery = (query: string, datasets: any[], visualizations: any[]): string[] => {
  const allInsights: string[] = [];
  
  // Generate insights for each dataset
  datasets.forEach((dataset) => {
    const visualization = visualizations.find(v => v.datasetId === dataset.id);
    if (visualization && visualization.data && visualization.data.length > 0) {
      try {
        // Use the existing insight generation function
        const datasetInsights = generateInsights(
          visualization.data,
          dataset.category,
          dataset.title
        );
        
        // Add relevant insights to the list
        if (datasetInsights && datasetInsights.length > 0) {
          // Take top 2 insights from each dataset
          allInsights.push(...datasetInsights.slice(0, 2));
        }
        
        // Add automatically detected patterns as insights
        const patternInsights = detectPatterns(visualization.data, dataset.category);
        if (patternInsights.length > 0) {
          allInsights.push(...patternInsights.slice(0, 2));
        }
      } catch (error) {
        console.error(`Error generating insights for ${dataset.title}:`, error);
      }
    }
  });
  
  // If we couldn't generate enough insights, add some generic ones
  if (allInsights.length < 3) {
    allInsights.push("Based on the available data, further analysis may be needed for a complete answer.");
    allInsights.push("Consider exploring additional datasets for more comprehensive insights.");
  }
  
  // Add a query-specific insight
  const queryKeywords = extractKeywords(query);
  if (queryKeywords.length > 0) {
    const focusKeyword = queryKeywords[0];
    allInsights.unshift(`The data shows significant patterns related to ${focusKeyword} that merit further investigation.`);
  }
  
  return allInsights;
};

// Generate a text answer based on the data and insights
export const generateAnswerFromData = (query: string, datasets: any[], visualizations: any[], insights: string[]): string => {
  // Extract main topic from the query
  const keywords = extractKeywords(query);
  const mainTopic = keywords.length > 0 ? keywords[0] : '';
  
  // Create an answer intro
  let answer = `Based on analysis of ${datasets.length} ${datasets.length === 1 ? 'dataset' : 'datasets'} related to ${mainTopic || 'your query'}, `;
  
  // Add information about the datasets used
  if (datasets.length === 1) {
    answer += `the "${datasets[0].title}" data shows that `;
  } else if (datasets.length === 2) {
    answer += `the ${datasets[0].title} and ${datasets[1].title} datasets indicate that `;
  } else {
    answer += `multiple datasets including ${datasets[0].title} suggest that `;
  }
  
  // Add a key insight from the data
  if (insights.length > 0) {
    // Remove any sentence-ending punctuation and convert first letter to lowercase
    const firstInsight = insights[0]
      .replace(/[.!?]$/, '')
      .replace(/^[A-Z]/, letter => letter.toLowerCase());
    
    answer += firstInsight + '. ';
  }
  
  // Add information about what the visualizations show
  const vizTypes = [...new Set(visualizations.map(v => v.type))];
  if (vizTypes.length > 0) {
    answer += `The ${vizTypes.join(' and ')} ${vizTypes.length === 1 ? 'chart' : 'charts'} ${vizTypes.length === 1 ? 'illustrates' : 'illustrate'} key patterns in the data. `;
  }
  
  // Add a closing statement with a suggestion
  answer += `For a more detailed understanding, explore the visualizations below and consider how these insights might inform decisions related to ${mainTopic || 'this topic'}.`;
  
  return answer;
};
