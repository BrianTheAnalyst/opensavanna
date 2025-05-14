
import { toast } from "sonner";
import { Dataset } from "@/types/dataset";
import { getDatasets, getDatasetVisualization } from "@/services";
import { transformSampleDataForCategory } from "@/services/visualization/dataTransformer";
import { generateInsights } from "@/utils/datasetVisualizationUtils";
import { getGeoJSONForDataset } from "@/services/visualization/datasetProcessor";

export interface DataInsightResult {
  question: string;
  answer: string;
  datasets: Dataset[];
  visualizations: {
    datasetId: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
    data: any[];
    category?: string;
    geoJSON?: any;
  }[];
  insights: string[];
  comparisonResult?: {
    title: string;
    description: string;
    data: any[];
  };
}

// Main function to process a user question and generate insights
export const processDataQuery = async (query: string): Promise<DataInsightResult> => {
  try {
    // 1. Analyze the question to determine relevant datasets
    const relevantDatasets = await findRelevantDatasets(query);
    if (!relevantDatasets.length) {
      throw new Error("No relevant datasets found for your question.");
    }

    // 2. Process each dataset to extract visualization data
    const visualizations = await Promise.all(
      relevantDatasets.map(async (dataset) => {
        try {
          const visualizationData = await getDatasetVisualization(dataset.id);
          const visType = determineVisualizationType(query, dataset.category);
          
          // Special handling for map visualizations
          let geoJSON = null;
          if (visType === 'map') {
            // Try to get GeoJSON data for the dataset
            geoJSON = await getGeoJSONForDataset(dataset.id);
            
            // If no GeoJSON but we need a map, add geo data to points if needed
            if (!geoJSON && visualizationData && visualizationData.length > 0) {
              visualizationData.forEach(item => {
                // Make sure points have coordinates for map rendering if they exist in the data
                if (item.latitude && !item.lat) item.lat = item.latitude;
                if (item.longitude && !item.lng) item.lng = item.longitude;
              });
            }
          }
          
          return {
            datasetId: dataset.id,
            title: dataset.title,
            type: visType,
            category: dataset.category,
            data: visualizationData && visualizationData.length > 0 
              ? visualizationData 
              : transformSampleDataForCategory(dataset.category, []),
            geoJSON: geoJSON
          };
        } catch (error) {
          console.error(`Error processing dataset ${dataset.title}:`, error);
          return {
            datasetId: dataset.id,
            title: dataset.title,
            type: 'bar' as const,
            category: dataset.category,
            data: transformSampleDataForCategory(dataset.category, [])
          };
        }
      })
    );

    // 3. Generate insights based on the data
    const allInsights = generateInsightsForQuery(query, relevantDatasets, visualizations);
    
    // 4. Generate a comparison if multiple datasets are available
    const comparisonResult = relevantDatasets.length > 1 
      ? generateComparison(relevantDatasets, visualizations)
      : undefined;

    // 5. Generate an answer to the question
    const answer = generateAnswerFromData(query, relevantDatasets, visualizations, allInsights);

    return {
      question: query,
      answer,
      datasets: relevantDatasets,
      visualizations,
      insights: allInsights,
      comparisonResult
    };
  } catch (error) {
    console.error("Error processing question:", error);
    toast.error("Failed to process your question");
    throw error;
  }
};

// Find datasets relevant to the user's question
const findRelevantDatasets = async (query: string): Promise<Dataset[]> => {
  // Get all datasets
  const allDatasets = await getDatasets();
  
  if (!allDatasets || allDatasets.length === 0) {
    return [];
  }
  
  // Extract keywords from the query
  const keywords = extractKeywords(query);
  
  // Score each dataset for relevance
  const scoredDatasets = allDatasets.map(dataset => {
    const titleScore = keywords.reduce((score, keyword) => {
      return dataset.title.toLowerCase().includes(keyword.toLowerCase()) ? score + 3 : score;
    }, 0);
    
    const descriptionScore = keywords.reduce((score, keyword) => {
      return dataset.description.toLowerCase().includes(keyword.toLowerCase()) ? score + 2 : score;
    }, 0);
    
    const categoryScore = keywords.reduce((score, keyword) => {
      return dataset.category.toLowerCase().includes(keyword.toLowerCase()) ? score + 4 : score;
    }, 0);
    
    const totalScore = titleScore + descriptionScore + categoryScore;
    
    return {
      dataset,
      score: totalScore
    };
  });
  
  // Sort by relevance score and take top 3
  const relevantDatasets = scoredDatasets
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.dataset);
  
  // If no datasets matched, return featured datasets or most recent ones
  if (relevantDatasets.length === 0) {
    const featuredDatasets = allDatasets.filter(d => d.featured);
    if (featuredDatasets.length > 0) {
      return featuredDatasets.slice(0, 3);
    }
    return allDatasets.slice(0, 3);
  }
  
  return relevantDatasets;
};

// Extract keywords from a query
const extractKeywords = (query: string): string[] => {
  // Remove common words and punctuation
  const stopWords = [
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 
    'on', 'at', 'for', 'with', 'about', 'between', 'into', 
    'to', 'from', 'by', 'as', 'of', 'show', 'me', 'give', 
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose',
    'how', 'why', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ];
  
  // Convert to lowercase and split into words
  const words = query.toLowerCase()
    .replace(/[.,?!;:(){}[\]]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Add specific category mapping
  const categoryMappings: Record<string, string[]> = {
    'economic': ['economics', 'economy', 'gdp', 'inflation', 'trade'],
    'health': ['healthcare', 'medical', 'hospital', 'disease', 'patient'],
    'education': ['school', 'university', 'student', 'learning', 'academic'],
    'transport': ['transportation', 'vehicle', 'traffic', 'road', 'travel'],
    'environment': ['environmental', 'climate', 'pollution', 'energy', 'sustainability']
  };
  
  const expandedWords = [...words];
  
  // Add category keywords if related words are found
  Object.entries(categoryMappings).forEach(([category, relatedWords]) => {
    if (relatedWords.some(word => words.includes(word))) {
      expandedWords.push(category);
    }
  });
  
  return [...new Set(expandedWords)]; // Remove duplicates
};

// Determine the best visualization type based on the query and category
const determineVisualizationType = (query: string, category: string): 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' => {
  const queryLower = query.toLowerCase();
  
  // Enhanced geo detection - look for more location-related keywords
  const geoKeywords = ['map', 'location', 'where', 'place', 'region', 'country', 
                      'city', 'area', 'geographic', 'spatial', 'territory', 'world'];
  
  if (geoKeywords.some(keyword => queryLower.includes(keyword))) {
    return 'map';
  }
  
  if (queryLower.includes('comparison') || queryLower.includes('compare') || queryLower.includes('versus') || queryLower.includes('vs')) {
    return 'bar';
  }
  
  if (queryLower.includes('trend') || queryLower.includes('time') || queryLower.includes('over time') || queryLower.includes('historical')) {
    return 'line';
  }
  
  if (queryLower.includes('distribution') || queryLower.includes('percentage') || queryLower.includes('proportion')) {
    return 'pie';
  }
  
  // Default visualization types based on category - enhance map detection for categories
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('geo') || categoryLower.includes('map') || 
      categoryLower.includes('regional') || categoryLower.includes('country') ||
      categoryLower.includes('territory')) {
    return 'map';
  }
  
  switch (categoryLower) {
    case 'economics':
      return queryLower.includes('time') ? 'line' : 'bar';
    case 'health':
      return queryLower.includes('distribution') ? 'pie' : 'bar';
    case 'transport':
      return queryLower.includes('network') || queryLower.includes('route') ? 'map' : 'bar';
    case 'education':
      return 'bar';
    case 'environment':
      return queryLower.includes('areas') || queryLower.includes('region') ? 'map' : 'line';
    default:
      return 'bar';
  }
};

// Generate insights based on the visualizations
const generateInsightsForQuery = (query: string, datasets: Dataset[], visualizations: any[]): string[] => {
  const allInsights: string[] = [];
  
  // Generate insights for each dataset
  datasets.forEach((dataset, index) => {
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

// Generate comparison between datasets if multiple are available
const generateComparison = (datasets: Dataset[], visualizations: any[]): { title: string; description: string; data: any[] } => {
  // Create a title based on the datasets being compared
  const title = `Comparison: ${datasets.map(d => d.title.split(' ').slice(0, 2).join(' ')).join(' vs ')}`;
  
  // Generate a description
  const description = `Comparative analysis of ${datasets.map(d => d.category).join(' and ')} datasets`;
  
  // Create comparison data by taking selected points from each dataset's visualizations
  const data = datasets.flatMap((dataset, index) => {
    const visualization = visualizations.find(v => v.datasetId === dataset.id);
    if (visualization && visualization.data && visualization.data.length > 0) {
      // Take top 2 data points from each dataset for comparison
      return visualization.data.slice(0, 2).map(item => ({
        ...item,
        dataset: dataset.title.split(' ').slice(0, 2).join(' ') // Add dataset name to data point
      }));
    }
    return [];
  });
  
  return { title, description, data };
};

// Generate a text answer based on the data and insights
const generateAnswerFromData = (query: string, datasets: Dataset[], visualizations: any[], insights: string[]): string => {
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

// Get suggested questions based on available datasets
export const getSuggestedQuestions = async (): Promise<string[]> => {
  try {
    const datasets = await getDatasets();
    
    if (!datasets || datasets.length === 0) {
      return DEFAULT_QUESTIONS;
    }
    
    // Group datasets by category
    const categoriesMap: Record<string, number> = {};
    datasets.forEach(dataset => {
      categoriesMap[dataset.category.toLowerCase()] = (categoriesMap[dataset.category.toLowerCase()] || 0) + 1;
    });
    
    // Generate questions based on available categories
    const questions: string[] = [];
    
    // Add category-specific questions
    Object.entries(categoriesMap).forEach(([category, count]) => {
      if (category === 'economics' || category === 'economy') {
        questions.push("What are the economic growth trends in Africa?");
        questions.push("How do economic indicators compare across different regions?");
      } else if (category === 'health' || category === 'healthcare') {
        questions.push("What is the state of healthcare access across different countries?");
        questions.push("How have health outcomes improved over the past decade?");
      } else if (category === 'education') {
        questions.push("What are the education enrollment rates by region?");
        questions.push("How does education spending correlate with literacy rates?");
      } else if (category === 'transport' || category === 'transportation') {
        questions.push("What are the most used transport modes in urban areas?");
        questions.push("How has transportation infrastructure developed over time?");
      } else if (category === 'environment') {
        questions.push("What environmental factors show the most concerning trends?");
        questions.push("How do different regions compare in environmental sustainability?");
      }
    });
    
    // If we have multiple categories, add comparison questions
    const categories = Object.keys(categoriesMap);
    if (categories.length >= 2) {
      questions.push(`How does ${categories[0]} relate to ${categories[1]}?`);
    }
    
    // Add some general questions
    questions.push("What are the key insights from the most recent datasets?");
    questions.push("Show me visualizations of the most important trends");
    
    // Return a random selection of 5 questions or fewer
    return questions.length <= 5 
      ? questions 
      : questions.sort(() => 0.5 - Math.random()).slice(0, 5);
  } catch (error) {
    console.error("Error generating suggested questions:", error);
    return DEFAULT_QUESTIONS;
  }
};

// Default suggested questions if we can't generate dynamic ones
const DEFAULT_QUESTIONS = [
  "What are the economic growth trends in Africa?",
  "How does healthcare access vary across different countries?",
  "What is the relationship between education and economic development?",
  "Show me visualizations of environmental data",
  "Compare transportation infrastructure across different regions"
];
