import { getDatasets } from "@/services";
import { Dataset } from "@/types/dataset";

export interface CategoryInfo {
  category: string;
  count: number;
  examples: string[];
}

export interface GuidanceResult {
  hasDatasets: boolean;
  totalDatasets: number;
  categories: CategoryInfo[];
  suggestedQueries: string[];
  missingCategories: string[];
  queryRefinements: string[];
}

// Get comprehensive guidance about available datasets
export const getDatasetGuidance = async (failedQuery?: string): Promise<GuidanceResult> => {
  try {
    const datasets = await getDatasets();
    
    if (!datasets || datasets.length === 0) {
      return {
        hasDatasets: false,
        totalDatasets: 0,
        categories: [],
        suggestedQueries: [],
        missingCategories: ['Economics', 'Health', 'Transport', 'Agriculture', 'Education', 'Environment', 'Demographics', 'Government'],
        queryRefinements: [
          'Upload the first dataset to get started',
          'Consider uploading datasets in common categories like Economics, Health, or Education',
          'Make sure your dataset includes proper metadata and descriptions'
        ]
      };
    }
    
    // Group datasets by category
    const categoryMap = new Map<string, Dataset[]>();
    datasets.forEach(dataset => {
      const category = dataset.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(dataset);
    });
    
    // Build category info
    const categories: CategoryInfo[] = Array.from(categoryMap.entries()).map(([category, categoryDatasets]) => ({
      category,
      count: categoryDatasets.length,
      examples: categoryDatasets.slice(0, 3).map(d => d.title)
    }));
    
    // Generate suggested queries based on available data
    const suggestedQueries = generateSuggestedQueries(datasets, categories);
    
    // Identify missing categories
    const allCategories = ['Economics', 'Health', 'Transport', 'Agriculture', 'Education', 'Environment', 'Demographics', 'Government'];
    const availableCategories = categories.map(c => c.category);
    const missingCategories = allCategories.filter(cat => 
      !availableCategories.some(availCat => availCat.toLowerCase() === cat.toLowerCase())
    );
    
    // Generate query refinements
    const queryRefinements = generateQueryRefinements(failedQuery, categories);
    
    return {
      hasDatasets: true,
      totalDatasets: datasets.length,
      categories: categories.sort((a, b) => b.count - a.count),
      suggestedQueries,
      missingCategories,
      queryRefinements
    };
  } catch (error) {
    console.error("Error getting dataset guidance:", error);
    return {
      hasDatasets: false,
      totalDatasets: 0,
      categories: [],
      suggestedQueries: [],
      missingCategories: [],
      queryRefinements: ['Unable to load dataset information. Please try again.']
    };
  }
};

// Generate relevant query suggestions based on available datasets
const generateSuggestedQueries = (datasets: Dataset[], categories: CategoryInfo[]): string[] => {
  const queries: string[] = [];
  
  // Category-based suggestions (top 3 categories)
  const topCategories = categories.slice(0, 3);
  
  topCategories.forEach(({ category, examples }) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('econom')) {
      queries.push(`What are the economic trends in ${examples[0]?.split(' ').slice(-1)[0] || 'Kenya'}?`);
      queries.push('Compare economic indicators across regions');
    } else if (categoryLower.includes('health')) {
      queries.push('Show healthcare access patterns');
      queries.push('What are the health outcome trends?');
    } else if (categoryLower.includes('education')) {
      queries.push('Analyze education enrollment trends');
      queries.push('Compare education metrics by region');
    } else if (categoryLower.includes('transport')) {
      queries.push('What are the transportation trends?');
      queries.push('Analyze transport infrastructure development');
    } else if (categoryLower.includes('environment')) {
      queries.push('Show environmental sustainability indicators');
      queries.push('What are the climate change impacts?');
    } else if (categoryLower.includes('agricult')) {
      queries.push('Analyze agricultural production trends');
      queries.push('Compare farming practices across regions');
    } else if (categoryLower.includes('demograph')) {
      queries.push('What are the population trends?');
      queries.push('Show demographic changes over time');
    } else if (categoryLower.includes('government')) {
      queries.push('Analyze government spending patterns');
      queries.push('Show governance indicators');
    } else {
      // Generic suggestion for other categories
      queries.push(`Show trends in ${category.toLowerCase()}`);
    }
  });
  
  // Add cross-category comparison if multiple categories exist
  if (categories.length >= 2) {
    queries.push(`How does ${categories[0].category.toLowerCase()} relate to ${categories[1].category.toLowerCase()}?`);
  }
  
  // Add general exploration queries
  queries.push('Show the most recent dataset insights');
  queries.push('What are the key trends in available data?');
  
  // Return unique queries, limited to 6
  return [...new Set(queries)].slice(0, 6);
};

// Generate query refinement suggestions
const generateQueryRefinements = (failedQuery: string | undefined, categories: CategoryInfo[]): string[] => {
  if (!failedQuery) {
    return [
      'Try asking about specific metrics or indicators',
      'Use category names in your query for better results',
      'Ask comparative questions across regions or time periods'
    ];
  }
  
  const refinements: string[] = [];
  const queryLower = failedQuery.toLowerCase();
  
  // Check if query mentions categories not available
  const mentionedMissingCategory = ['economics', 'health', 'education', 'transport', 'environment', 'agriculture', 'demographics', 'government']
    .find(cat => queryLower.includes(cat) && !categories.some(c => c.category.toLowerCase().includes(cat)));
  
  if (mentionedMissingCategory) {
    refinements.push(`No ${mentionedMissingCategory} datasets available. Try uploading one or explore available categories: ${categories.slice(0, 3).map(c => c.category).join(', ')}`);
  }
  
  // Suggest being more specific
  if (failedQuery.split(' ').length <= 3) {
    refinements.push('Try being more specific in your query. For example: "What are the population trends in Nairobi from 2020-2023?"');
  }
  
  // Suggest available categories
  if (categories.length > 0) {
    refinements.push(`Available data categories: ${categories.map(c => c.category).join(', ')}`);
  }
  
  // Suggest query patterns
  refinements.push('Try queries like: "Compare X across Y" or "Show trends in Z over time"');
  
  // Suggest exploring recent data
  refinements.push('Ask about "recent trends" or "latest data" to see the most current information');
  
  return refinements.slice(0, 4);
};
