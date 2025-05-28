// Data summary service - provides high-level summaries of datasets and visualizations

/**
 * Generates a concise summary of a dataset's visualizations
 */
export const generateVisualizationSummary = (data: any[], category: string, vizType: string): string => {
  if (!data || data.length === 0) {
    return 'No data available for summary.';
  }
  
  try {
    const categoryLower = category.toLowerCase();
    
    // For line charts, focus on trends
    if (vizType === 'line') {
      return generateTrendSummary(data, categoryLower);
    }
    
    // For pie charts, focus on proportions
    if (vizType === 'pie') {
      return generateDistributionSummary(data, categoryLower);
    }
    
    // For bar charts, focus on comparisons
    if (vizType === 'bar') {
      return generateComparisonSummary(data, categoryLower);
    }
    
    // Default summary
    return generateGenericSummary(data, categoryLower);
    
  } catch (error) {
    console.error('Error generating visualization summary:', error);
    return 'Summary unavailable.';
  }
};

/**
 * Generates a summary focused on trends in time series data
 */
const generateTrendSummary = (data: any[], category: string): string => {
  if (data.length < 2) return 'Insufficient data for trend analysis.';
  
  const sortedData = [...data].sort((a, b) => {
    // Try to sort by timeStamp if available
    if (a.timeStamp && b.timeStamp) {
      return new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime();
    }
    // Otherwise try to parse dates from names
    return 0;
  });
  
  const first = sortedData[0];
  const last = sortedData[sortedData.length - 1];
  const change = last.value - first.value;
  const percentChange = ((change / first.value) * 100).toFixed(1);
  const direction = change > 0 ? 'increased' : 'decreased';
  
  // Check if there are any projected values
  const hasProjections = data.some(d => d.projected);
  
  let summary = '';
  
  if (category.includes('economic')) {
    summary = `Economic indicators have ${direction} by ${Math.abs(parseFloat(percentChange))}% over the period.`;
  } else if (category.includes('health')) {
    summary = `Health metrics have ${direction} by ${Math.abs(parseFloat(percentChange))}% from ${first.name} to ${last.name}.`;
  } else if (category.includes('education')) {
    summary = `Education statistics show a ${direction} of ${Math.abs(parseFloat(percentChange))}% throughout the timeline.`;
  } else {
    summary = `The data shows a ${direction} of ${Math.abs(parseFloat(percentChange))}% from ${first.name} to ${last.name}.`;
  }
  
  // Add projection statement if relevant
  if (hasProjections) {
    summary += ` Projections indicate this trend will continue into future periods.`;
  }
  
  return summary;
};

/**
 * Generates a summary focused on distribution proportions
 */
const generateDistributionSummary = (data: any[], category: string): string => {
  if (data.length === 0) return 'No distribution data available.';
  
  // Sort data by value, descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const topItem = sortedData[0];
  
  // Calculate total
  const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentage of top item
  const topPercentage = ((topItem.value / totalValue) * 100).toFixed(1);
  
  // Calculate percentage of top 3 items (if we have at least 3)
  let top3Percentage = '0';
  if (sortedData.length >= 3) {
    const top3Total = sortedData.slice(0, 3).reduce((sum, item) => sum + item.value, 0);
    top3Percentage = ((top3Total / totalValue) * 100).toFixed(1);
  }
  
  let summary = '';
  if (category.includes('economic')) {
    summary = `${topItem.name} represents the largest segment at ${topPercentage}% of the economic distribution.`;
    if (sortedData.length >= 3) {
      summary += ` The top 3 categories account for ${top3Percentage}% of the total.`;
    }
  } else if (sortedData.length >= 3) {
    summary = `${topItem.name} leads with ${topPercentage}% share, with the top 3 categories comprising ${top3Percentage}% of the total.`;
  } else {
    summary = `${topItem.name} represents ${topPercentage}% of the total distribution.`;
  }
  
  return summary;
};

/**
 * Generates a summary focused on comparisons
 */
const generateComparisonSummary = (data: any[], category: string): string => {
  if (data.length < 2) return 'Insufficient data for comparison.';
  
  // Sort data by value, descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const highest = sortedData[0];
  const secondHighest = sortedData[1];
  
  // Calculate percentage difference between top two
  const percentDiff = ((highest.value - secondHighest.value) / secondHighest.value * 100).toFixed(1);
  
  let summary = '';
  if (parseFloat(percentDiff) > 10) {
    summary = `${highest.name} leads significantly at ${highest.value}, which is ${percentDiff}% higher than ${secondHighest.name}.`;
  } else {
    summary = `${highest.name} (${highest.value}) and ${secondHighest.name} (${secondHighest.value}) are the top performers with a relatively small gap of ${percentDiff}%.`;
  }
  
  // Add context based on category
  if (category.includes('economic')) {
    summary += ` This comparison highlights relative economic strength across categories.`;
  } else if (category.includes('health')) {
    summary += ` These health metrics indicate areas of priority and performance.`;
  } else if (category.includes('education')) {
    summary += ` This educational data comparison reveals performance differentials.`;
  }
  
  return summary;
};

/**
 * Generates a generic data summary
 */
const generateGenericSummary = (data: any[], category: string): string => {
  const count = data.length;
  const values = data.map(item => item.value);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = (sum / count).toFixed(1);
  
  return `Analysis of ${count} data points with an average value of ${avg} across ${category} categories.`;
};

/**
 * Generates recommendations based on data patterns
 */
export const generateDataRecommendations = (data: any[], category: string): string[] => {
  const recommendations: string[] = [];
  
  if (!data || data.length === 0) {
    return ['Insufficient data to provide recommendations.'];
  }
  
  const categoryLower = category.toLowerCase();
  
  // Economic recommendations
  if (categoryLower.includes('economic')) {
    recommendations.push('Consider analyzing factors driving economic performance differences.');
    recommendations.push('Explore correlation between economic indicators and other development metrics.');
  } 
  
  // Health recommendations
  else if (categoryLower.includes('health')) {
    recommendations.push('Investigate healthcare resource allocation based on outcome disparities.');
    recommendations.push('Consider demographic analysis to understand health metric variations.');
  }
  
  // Education recommendations
  else if (categoryLower.includes('education')) {
    recommendations.push('Examine educational policy impacts on performance metrics.');
    recommendations.push('Consider regional analysis of education outcomes to identify successful programs.');
  }
  
  // Generic recommendations
  else {
    recommendations.push('Explore additional data dimensions to understand causal factors.');
    recommendations.push('Consider time-series analysis to identify emerging trends.');
  }
  
  // Add visualization recommendation
  recommendations.push('Try alternative visualization types to highlight different patterns in the data.');
  
  return recommendations;
};
