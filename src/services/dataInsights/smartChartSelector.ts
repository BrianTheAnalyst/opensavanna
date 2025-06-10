
interface DataCharacteristics {
  totalRecords: number;
  numericFields: number;
  categoricalFields: number;
  hasTimeData: boolean;
  hasGeoData: boolean;
  uniqueCategories: number;
  dataDistribution: 'uniform' | 'skewed' | 'concentrated';
  complexity: 'simple' | 'medium' | 'complex';
}

interface ChartRecommendation {
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
  priority: number;
  reasoning: string;
  suitability: number; // 0-1 score
}

// Analyze data characteristics to determine optimal chart types
export const analyzeDataCharacteristics = (data: any[]): DataCharacteristics => {
  if (!data || data.length === 0) {
    return {
      totalRecords: 0,
      numericFields: 0,
      categoricalFields: 0,
      hasTimeData: false,
      hasGeoData: false,
      uniqueCategories: 0,
      dataDistribution: 'uniform',
      complexity: 'simple'
    };
  }

  const sample = data[0];
  const fields = Object.keys(sample);
  
  let numericFields = 0;
  let categoricalFields = 0;
  let hasTimeData = false;
  let hasGeoData = false;

  // Analyze field types
  fields.forEach(field => {
    const value = sample[field];
    if (typeof value === 'number' || !isNaN(Number(value))) {
      numericFields++;
    } else {
      categoricalFields++;
    }

    // Check for time-related fields
    if (field.toLowerCase().includes('date') || 
        field.toLowerCase().includes('time') || 
        field.toLowerCase().includes('year')) {
      hasTimeData = true;
    }

    // Check for geographic fields
    if (field.toLowerCase().includes('lat') || 
        field.toLowerCase().includes('lng') || 
        field.toLowerCase().includes('country') ||
        field.toLowerCase().includes('region')) {
      hasGeoData = true;
    }
  });

  // Calculate unique categories for categorical data
  const uniqueCategories = new Set(data.map(item => item.name || item.category || '')).size;

  // Determine data distribution
  const values = data.map(item => Number(item.value) || 0).filter(v => !isNaN(v));
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const coefficient = Math.sqrt(variance) / mean;
  
  let dataDistribution: 'uniform' | 'skewed' | 'concentrated';
  if (coefficient < 0.5) dataDistribution = 'uniform';
  else if (coefficient < 1.5) dataDistribution = 'skewed';
  else dataDistribution = 'concentrated';

  // Determine complexity
  let complexity: 'simple' | 'medium' | 'complex';
  if (data.length <= 10 && uniqueCategories <= 5) complexity = 'simple';
  else if (data.length <= 50 && uniqueCategories <= 15) complexity = 'medium';
  else complexity = 'complex';

  return {
    totalRecords: data.length,
    numericFields,
    categoricalFields,
    hasTimeData,
    hasGeoData,
    uniqueCategories,
    dataDistribution,
    complexity
  };
};

// Smart chart recommendation engine
export const recommendCharts = (
  data: any[], 
  category: string, 
  query: string
): ChartRecommendation[] => {
  const characteristics = analyzeDataCharacteristics(data);
  const recommendations: ChartRecommendation[] = [];
  
  // Geographic data - prioritize maps
  if (characteristics.hasGeoData) {
    recommendations.push({
      type: 'map',
      priority: 1,
      reasoning: 'Geographic data detected - map visualization provides spatial context',
      suitability: 0.95
    });
  }

  // Time series data - prioritize line charts
  if (characteristics.hasTimeData || query.toLowerCase().includes('trend') || query.toLowerCase().includes('time')) {
    recommendations.push({
      type: 'line',
      priority: characteristics.hasTimeData ? 1 : 2,
      reasoning: 'Time-based data detected - line chart shows trends effectively',
      suitability: 0.9
    });
  }

  // Categorical comparison - bar charts
  if (characteristics.categoricalFields > 0 && characteristics.uniqueCategories <= 20) {
    recommendations.push({
      type: 'bar',
      priority: 2,
      reasoning: 'Categorical data with manageable categories - bar chart enables easy comparison',
      suitability: 0.85
    });
  }

  // Distribution analysis - pie charts for simple data
  if (characteristics.uniqueCategories <= 8 && characteristics.complexity === 'simple') {
    recommendations.push({
      type: 'pie',
      priority: 3,
      reasoning: 'Simple categorical distribution - pie chart shows proportions clearly',
      suitability: 0.8
    });
  }

  // Area charts for cumulative or volume data
  if (query.toLowerCase().includes('volume') || 
      query.toLowerCase().includes('total') || 
      characteristics.dataDistribution === 'concentrated') {
    recommendations.push({
      type: 'area',
      priority: 3,
      reasoning: 'Volume or cumulative data - area chart emphasizes magnitude',
      suitability: 0.75
    });
  }

  // Radar charts for multi-dimensional comparison
  if (characteristics.numericFields >= 3 && characteristics.uniqueCategories <= 5) {
    recommendations.push({
      type: 'radar',
      priority: 4,
      reasoning: 'Multi-dimensional data with few entities - radar chart shows patterns',
      suitability: 0.7
    });
  }

  // Fallback to bar chart if no specific recommendations
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'bar',
      priority: 5,
      reasoning: 'Default visualization for general data comparison',
      suitability: 0.6
    });
  }

  // Sort by priority and suitability
  return recommendations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.suitability - a.suitability;
  });
};

// Enhanced chart type determination with smart recommendations
export const determineOptimalVisualizationType = (
  query: string, 
  category: string, 
  data: any[]
): 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' => {
  const recommendations = recommendCharts(data, category, query);
  return recommendations[0]?.type || 'bar';
};
