
// Re-export everything from the dataInsights module
export * from './dataInsights';
export { generateCompleteDataInsights } from './dataInsights';

// Legacy exports for backward compatibility
export type { DataInsightResult } from './dataInsights/types';

import { getDatasets } from './datasetService';
import { generateCompleteDataInsights } from './dataInsights';
import { transformDataForVisualization, determineVisualizationType } from './dataInsights/visualizationUtils';

// Main service function that processes data queries
export const processDataQuery = async (
  query: string,
  datasets: any[] = []
): Promise<any> => {
  try {
    console.log('Processing data query:', query);
    
    // If no datasets provided, fetch available datasets
    let availableDatasets = datasets;
    if (datasets.length === 0) {
      console.log('Fetching available datasets...');
      availableDatasets = await getDatasets();
    }
    
    if (!availableDatasets || availableDatasets.length === 0) {
      return {
        question: query,
        answer: 'No datasets are currently available for analysis.',
        insights: ['No datasets available for analysis'],
        visualizations: [],
        datasets: [],
        followUpQuestions: [
          'Upload a new dataset to get started',
          'Check back later for new data'
        ]
      };
    }
    
    console.log(`Found ${availableDatasets.length} datasets for analysis`);
    
    // Find relevant datasets based on query keywords
    const queryLower = query.toLowerCase();
    const relevantDatasets = availableDatasets.filter(dataset => {
      const titleMatch = dataset.title.toLowerCase().includes(queryLower);
      const categoryMatch = dataset.category.toLowerCase().includes(queryLower);
      const descMatch = dataset.description?.toLowerCase().includes(queryLower);
      
      // Check for category-specific keywords
      const economicsKeywords = ['economic', 'gdp', 'trade', 'employment', 'inflation'];
      const healthKeywords = ['health', 'medical', 'disease', 'hospital', 'mortality'];
      const educationKeywords = ['education', 'school', 'literacy', 'enrollment'];
      const transportKeywords = ['transport', 'traffic', 'road', 'vehicle', 'infrastructure'];
      const environmentKeywords = ['environment', 'climate', 'temperature', 'pollution'];
      
      const hasEconomicsKeywords = economicsKeywords.some(keyword => queryLower.includes(keyword));
      const hasHealthKeywords = healthKeywords.some(keyword => queryLower.includes(keyword));
      const hasEducationKeywords = educationKeywords.some(keyword => queryLower.includes(keyword));
      const hasTransportKeywords = transportKeywords.some(keyword => queryLower.includes(keyword));
      const hasEnvironmentKeywords = environmentKeywords.some(keyword => queryLower.includes(keyword));
      
      const categoryRelevant = 
        (hasEconomicsKeywords && dataset.category.toLowerCase().includes('economic')) ||
        (hasHealthKeywords && dataset.category.toLowerCase().includes('health')) ||
        (hasEducationKeywords && dataset.category.toLowerCase().includes('education')) ||
        (hasTransportKeywords && dataset.category.toLowerCase().includes('transport')) ||
        (hasEnvironmentKeywords && dataset.category.toLowerCase().includes('environment'));
      
      return titleMatch || categoryMatch || descMatch || categoryRelevant;
    });
    
    // If no specific matches, take a sample of datasets
    const datasetsToAnalyze = relevantDatasets.length > 0 
      ? relevantDatasets.slice(0, 3) 
      : availableDatasets.slice(0, 3);
    
    console.log(`Analyzing ${datasetsToAnalyze.length} relevant datasets`);
    
    // Generate insights and visualizations for each dataset
    const visualizations = [];
    const allInsights = [];
    
    for (const dataset of datasetsToAnalyze) {
      try {
        // Generate mock data for visualization (in a real app, this would fetch actual data)
        const mockData = generateMockDataForDataset(dataset);
        const transformedData = transformDataForVisualization(mockData, dataset.category, query);
        const vizType = determineVisualizationType(transformedData, dataset.category);
        
        // Generate insights for this dataset - fix: pass the query parameter
        const datasetInsights = await generateCompleteDataInsights(transformedData, dataset.category, query);
        
        visualizations.push({
          datasetId: dataset.id,
          title: `${dataset.title} - ${vizType.charAt(0).toUpperCase() + vizType.slice(1)} Chart`,
          type: vizType,
          category: dataset.category,
          data: transformedData,
          timeAxis: dataset.category === 'economics' ? 'Year' : undefined,
          valueLabel: getValueLabelForCategory(dataset.category)
        });
        
        allInsights.push(...datasetInsights.insights);
      } catch (error) {
        console.error(`Error processing dataset ${dataset.id}:`, error);
      }
    }
    
    // Generate follow-up questions
    const followUpQuestions = generateFollowUpQuestions(query, datasetsToAnalyze);
    
    // Create comprehensive answer
    const answer = generateAnswerFromQuery(query, datasetsToAnalyze, allInsights);
    
    return {
      question: query,
      answer,
      insights: allInsights.slice(0, 8), // Limit to top 8 insights
      visualizations,
      datasets: datasetsToAnalyze,
      followUpQuestions,
      dataPoints: visualizations.reduce((sum, viz) => sum + viz.data.length, 0),
      summary: `Analysis of ${datasetsToAnalyze.length} datasets with ${visualizations.length} visualizations generated.`
    };
    
  } catch (error) {
    console.error('Error processing data query:', error);
    return {
      question: query,
      answer: 'Sorry, there was an error processing your question. Please try again.',
      insights: ['Error processing query: ' + (error?.message || 'Unknown error')],
      visualizations: [],
      datasets: [],
      followUpQuestions: [
        'Try rephrasing your question',
        'Ask about a specific data category',
        'Check if datasets are available'
      ]
    };
  }
};

// Helper function to generate mock data for a dataset
function generateMockDataForDataset(dataset: any) {
  const baseData = [];
  const categories = ['2020', '2021', '2022', '2023', '2024'];
  
  for (let i = 0; i < 5; i++) {
    const value = Math.floor(Math.random() * 100) + 20;
    baseData.push({
      name: categories[i],
      value: value,
      category: dataset.category,
      year: categories[i]
    });
  }
  
  return baseData;
}

// Helper function to get appropriate value label for category
function getValueLabelForCategory(category: string): string {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic')) return 'Value (USD)';
  if (categoryLower.includes('health')) return 'Count';
  if (categoryLower.includes('education')) return 'Percentage';
  if (categoryLower.includes('transport')) return 'Usage Count';
  if (categoryLower.includes('environment')) return 'Index Value';
  
  return 'Value';
}

// Helper function to generate follow-up questions
function generateFollowUpQuestions(query: string, datasets: any[]): string[] {
  const questions = [];
  const queryLower = query.toLowerCase();
  
  // Add category-specific follow-ups
  const categories = [...new Set(datasets.map(d => d.category))];
  
  if (categories.length > 1) {
    questions.push(`Compare ${categories[0]} with ${categories[1]} data`);
  }
  
  if (queryLower.includes('trend')) {
    questions.push('Show me historical patterns in this data');
  } else {
    questions.push('What are the trends in this data over time?');
  }
  
  if (queryLower.includes('compare')) {
    questions.push('Show me regional differences in this data');
  } else {
    questions.push('How do different regions compare?');
  }
  
  questions.push('What insights can you provide about this data?');
  questions.push('Show me a different visualization of this data');
  
  return questions.slice(0, 4);
}

// Helper function to generate answer from query
function generateAnswerFromQuery(query: string, datasets: any[], insights: string[]): string {
  const datasetCount = datasets.length;
  const categories = [...new Set(datasets.map(d => d.category))];
  
  let answer = `Based on your question "${query}", I analyzed ${datasetCount} relevant dataset${datasetCount > 1 ? 's' : ''} `;
  
  if (categories.length > 0) {
    answer += `covering ${categories.join(', ')} data. `;
  }
  
  if (insights.length > 0) {
    answer += `Key findings include: ${insights[0]}`;
    if (insights.length > 1) {
      answer += ` Additionally, ${insights[1]}`;
    }
  }
  
  answer += ' The visualizations below show the detailed analysis results.';
  
  return answer;
}
