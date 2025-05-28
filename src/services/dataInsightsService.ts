
// Re-export everything from the dataInsights module
export * from './dataInsights';
export { generateCompleteDataInsights } from './dataInsights';

// Legacy exports for backward compatibility
export type { DataInsightResult } from './dataInsights/types';

// Main service function that processes data queries
export const processDataQuery = async (
  query: string,
  datasets: any[] = []
): Promise<any> => {
  // This is a simplified implementation for compatibility
  try {
    const { generateCompleteDataInsights } = await import('./dataInsights');
    
    if (datasets.length > 0) {
      const result = await generateCompleteDataInsights(datasets, 'general', query);
      return {
        insights: result.insights,
        visualizations: [],
        datasets: datasets
      };
    }
    
    return {
      insights: ['No datasets available for analysis'],
      visualizations: [],
      datasets: []
    };
  } catch (error) {
    console.error('Error processing data query:', error);
    return {
      insights: ['Error processing query'],
      visualizations: [],
      datasets: []
    };
  }
};
