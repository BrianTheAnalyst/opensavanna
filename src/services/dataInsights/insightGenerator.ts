import { Dataset } from '@/types/dataset';
import { DataInsightResult } from './types';
import { 
  determineVisualizationType, 
  generateTimeSeriesData,
  transformDataForVisualization,
  generateAxisLabels
} from './visualizationUtils';
import { generateDataDrivenInsights } from './enhancedInsightGenerator';

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

// Enhanced insight generation with better data processing
export const generateInsightsFromDatasets = async (
  datasets: Dataset[], 
  query: string
): Promise<DataInsightResult> => {
  console.log("Generating insights from datasets:", datasets.length);
  
  const visualizations = datasets.map(dataset => {
    // Generate sample data based on dataset characteristics
    const sampleData = generateEnhancedSampleData(dataset, query);
    
    // Transform data for optimal visualization
    const transformedData = transformDataForVisualization(sampleData, dataset.category, query);
    
    // Intelligently determine visualization type
    const vizType = determineVisualizationType(query, dataset.category, transformedData);
    
    // Generate proper axis labels
    const { xAxisLabel, yAxisLabel } = generateAxisLabels(transformedData, dataset.category, query, vizType);
    
    // Handle time series data
    const finalData = vizType === 'line' 
      ? generateTimeSeriesData(query, transformedData, dataset.category)
      : transformedData;
    
    return {
      datasetId: dataset.id,
      title: `${dataset.title} - ${getVisualizationTitle(vizType, dataset.category)}`,
      type: vizType,
      category: dataset.category,
      data: finalData,
      timeAxis: vizType === 'line' ? xAxisLabel : undefined,
      valueLabel: yAxisLabel
    };
  });
  
  // Generate comprehensive insights
  const allData = visualizations.flatMap(v => v.data || []);
  const insights = generateDataDrivenInsights(allData, datasets[0]?.category || '', query, datasets[0]?.title || '');
  
  // Generate comparison if multiple datasets
  const comparisonResult = datasets.length > 1 ? generateEnhancedComparison(datasets, visualizations) : undefined;
  
  // Generate follow-up questions
  const followUpQuestions = generateContextualFollowUpQuestions(datasets, query);
  
  return {
    question: query,
    answer: generateContextualAnswer(datasets, query, insights),
    datasets,
    visualizations,
    insights,
    comparisonResult,
    followUpQuestions
  };
};

// Generate enhanced sample data based on dataset characteristics
const generateEnhancedSampleData = (dataset: Dataset, query: string): any[] => {
  const category = dataset.category.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Generate realistic data based on dataset characteristics
  if (category.includes('economic')) {
    return generateEconomicData(dataset, queryLower);
  } else if (category.includes('health')) {
    return generateHealthData(dataset, queryLower);
  } else if (category.includes('education')) {
    return generateEducationData(dataset, queryLower);
  } else if (category.includes('transport')) {
    return generateTransportData(dataset, queryLower);
  } else if (category.includes('environment')) {
    return generateEnvironmentData(dataset, queryLower);
  }
  
  return generateGenericData(dataset, queryLower);
};

// Economic data generator
const generateEconomicData = (dataset: Dataset, query: string): any[] => {
  if (query.includes('gdp') || query.includes('growth')) {
    return [
      { name: 'East Africa', value: 6.8, region: 'Africa' },
      { name: 'West Africa', value: 5.2, region: 'Africa' },
      { name: 'Southern Africa', value: 2.1, region: 'Africa' },
      { name: 'North Africa', value: 3.4, region: 'Africa' },
      { name: 'Central Africa', value: 4.7, region: 'Africa' }
    ];
  }
  
  if (query.includes('trade') || query.includes('export')) {
    return [
      { name: 'Agriculture', value: 2800, sector: 'Primary' },
      { name: 'Mining', value: 4200, sector: 'Primary' },
      { name: 'Manufacturing', value: 3600, sector: 'Secondary' },
      { name: 'Services', value: 5100, sector: 'Tertiary' },
      { name: 'Technology', value: 1900, sector: 'Quaternary' }
    ];
  }
  
  return [
    { name: 'Q1 2024', value: 2450 },
    { name: 'Q2 2024', value: 2680 },
    { name: 'Q3 2024', value: 2520 },
    { name: 'Q4 2024', value: 2890 }
  ];
};

// Health data generator
const generateHealthData = (dataset: Dataset, query: string): any[] => {
  if (query.includes('mortality') || query.includes('death')) {
    return [
      { name: 'Infant Mortality', value: 32, per1000: true },
      { name: 'Maternal Mortality', value: 485, per100000: true },
      { name: 'Under-5 Mortality', value: 67, per1000: true },
      { name: 'Adult Mortality', value: 248, per1000: true }
    ];
  }
  
  if (query.includes('vaccination') || query.includes('immunization')) {
    return [
      { name: 'BCG', value: 92, coverage: true },
      { name: 'DPT3', value: 87, coverage: true },
      { name: 'Measles', value: 84, coverage: true },
      { name: 'Polio', value: 89, coverage: true },
      { name: 'Hepatitis B', value: 79, coverage: true }
    ];
  }
  
  return [
    { name: 'Life Expectancy', value: 64.2 },
    { name: 'Healthcare Access', value: 68.5 },
    { name: 'Health Spending (% GDP)', value: 4.8 },
    { name: 'Doctor Density', value: 0.38 }
  ];
};

// Education data generator
const generateEducationData = (dataset: Dataset, query: string): any[] => {
  if (query.includes('enrollment') || query.includes('school')) {
    return [
      { name: 'Primary Enrollment', value: 91.2, level: 'Primary' },
      { name: 'Secondary Enrollment', value: 67.8, level: 'Secondary' },
      { name: 'Tertiary Enrollment', value: 32.4, level: 'Tertiary' },
      { name: 'Pre-primary Enrollment', value: 45.6, level: 'Pre-primary' }
    ];
  }
  
  if (query.includes('literacy')) {
    return [
      { name: 'Adult Literacy', value: 76.3 },
      { name: 'Youth Literacy', value: 88.7 },
      { name: 'Female Literacy', value: 69.2 },
      { name: 'Male Literacy', value: 82.1 }
    ];
  }
  
  return [
    { name: 'Education Index', value: 0.542 },
    { name: 'Completion Rate', value: 73.8 },
    { name: 'Education Spending', value: 5.2 },
    { name: 'Teacher-Student Ratio', value: 28.4 }
  ];
};

// Transport data generator
const generateTransportData = (dataset: Dataset, query: string): any[] => {
  return [
    { name: 'Road Network', value: 45680, unit: 'km' },
    { name: 'Railway Network', value: 2847, unit: 'km' },
    { name: 'Airports', value: 127, unit: 'facilities' },
    { name: 'Ports', value: 23, unit: 'facilities' },
    { name: 'Public Transport', value: 68.4, unit: 'coverage_%' }
  ];
};

// Environment data generator
const generateEnvironmentData = (dataset: Dataset, query: string): any[] => {
  if (query.includes('emissions') || query.includes('carbon')) {
    return [
      { name: 'CO2 Emissions', value: 1.2, unit: 'tons_per_capita' },
      { name: 'Forest Coverage', value: 23.7, unit: 'percentage' },
      { name: 'Renewable Energy', value: 76.8, unit: 'percentage' },
      { name: 'Water Access', value: 82.3, unit: 'percentage' }
    ];
  }
  
  return [
    { name: 'Air Quality Index', value: 78 },
    { name: 'Water Quality', value: 85.2 },
    { name: 'Biodiversity Index', value: 0.712 },
    { name: 'Environmental Performance', value: 42.8 }
  ];
};

// Generic data generator
const generateGenericData = (dataset: Dataset, query: string): any[] => {
  return [
    { name: 'Category A', value: 245 },
    { name: 'Category B', value: 189 },
    { name: 'Category C', value: 312 },
    { name: 'Category D', value: 156 },
    { name: 'Category E', value: 278 }
  ];
};

// Get appropriate visualization title
const getVisualizationTitle = (type: string, category: string): string => {
  const categoryPrefix = category.charAt(0).toUpperCase() + category.slice(1);
  
  switch (type) {
    case 'line':
      return 'Trend Analysis';
    case 'bar':
      return `${categoryPrefix} Comparison`;
    case 'pie':
      return `${categoryPrefix} Distribution`;
    case 'map':
      return 'Geographic Analysis';
    default:
      return `${categoryPrefix} Analysis`;
  }
};

// Generate contextual answer based on data and query
const generateContextualAnswer = (datasets: Dataset[], query: string, insights: string[]): string => {
  // Construct a meaningful high-level summary using dataset info and insights
  let answer = "";
  const datasetNames = datasets.map(ds => ds.title).join(', ');
  
  // Start with a contextual prefix based on the query type
  if (query.toLowerCase().includes('how')) {
    answer += `Based on ${datasetNames}, `;
  } else if (query.toLowerCase().includes('why')) {
    answer += `The analysis of ${datasetNames} indicates that `;
  } else if (query.toLowerCase().includes('when')) {
    answer += `Examining the temporal patterns in ${datasetNames} shows that `;
  } else if (query.toLowerCase().includes('where')) {
    answer += `The geographic analysis of ${datasetNames} reveals that `;
  } else {
    answer += `Analysis of ${datasetNames} demonstrates that `;
  }
  
  // Add a summary of key insights if available
  if (insights.length > 0) {
    answer += insights[0];
    
    if (insights.length > 1) {
      answer += ` Additionally, ${insights[1].toLowerCase()}`;
    }
  } else {
    answer += `the data provides several interesting patterns worth exploring in the visualizations below.`;
  }
  
  // Add a concluding remark about the visualizations
  answer += ` The visualizations below highlight the key patterns and relationships in the data.`;
  
  return answer;
};

// Generate enhanced comparison data
const generateEnhancedComparison = (datasets: Dataset[], visualizations: DataInsightResult['visualizations']): { title: string; description: string; data: any[] } => {
  // Create a title based on the datasets being compared
  const title = datasets.length > 1
    ? `Comparison: ${datasets.map(d => d.title.split(' ').slice(0, 2).join(' ')).join(' vs ')}`
    : `Analysis: ${datasets[0].title}`;
  
  // Generate a description
  const description = `Comparative analysis of ${datasets.map(d => d.category).join(' and ')} datasets`;
  
  // Create comparison data by taking key points from each dataset's visualizations
  const data = datasets.flatMap((dataset, index) => {
    const visualization = visualizations.find(v => v.datasetId === dataset.id);
    if (visualization && visualization.data && visualization.data.length > 0) {
      // Take top 2-3 data points from each dataset for comparison
      return visualization.data
        .slice(0, 3)
        .map(item => ({
          ...item,
          dataset: dataset.title.split(' ').slice(0, 2).join(' ') // Add dataset name to data point
        }));
    }
    return [];
  });
  
  return { title, description, data };
};

// Generate contextual follow-up questions
const generateContextualFollowUpQuestions = (datasets: Dataset[], query: string): string[] => {
  const questions: string[] = [];
  const queryLower = query.toLowerCase();
  const category = datasets[0]?.category.toLowerCase() || '';
  
  // Time-based follow-up
  if (!queryLower.includes('over time') && !queryLower.includes('trend')) {
    questions.push(`How have these patterns changed over time?`);
  }
  
  // Geographic follow-up
  if (!queryLower.includes('map') && !queryLower.includes('where') && !queryLower.includes('region')) {
    questions.push(`What is the geographic distribution of ${category}?`);
  }
  
  // Comparison follow-up
  if (!queryLower.includes('compare') && !queryLower.includes('versus') && datasets.length === 1) {
    questions.push(`How does this compare to other ${category} datasets?`);
  }
  
  // Cause and correlation follow-up
  questions.push(`What factors are correlated with these ${category} patterns?`);
  
  // Forecast follow-up
  if (!queryLower.includes('predict') && !queryLower.includes('forecast')) {
    questions.push(`What are the projected ${category} trends for the next year?`);
  }
  
  // Add domain-specific follow-up questions
  if (category.includes('economic')) {
    questions.push(`What is the economic growth rate by region?`);
  } else if (category.includes('health')) {
    questions.push(`How has healthcare access affected health outcomes?`);
  } else if (category.includes('education')) {
    questions.push(`Which educational metrics show the greatest improvement?`);
  }
  
  // Return unique questions, limited to 5
  return [...new Set(questions)].slice(0, 5);
};
