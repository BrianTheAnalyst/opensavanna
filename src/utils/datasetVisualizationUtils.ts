
// Helper functions for dataset visualization and sample data generation

// Generate sample data based on category and title
export const generateSampleData = (category: string, title: string) => {
  // Special case for Transaction History
  if (title.toLowerCase().includes('transaction') || title.toLowerCase().includes('financial')) {
    return [
      { name: 'Groceries', value: 425 },
      { name: 'Utilities', value: 290 },
      { name: 'Entertainment', value: 385 },
      { name: 'Transportation', value: 340 },
      { name: 'Dining', value: 510 },
      { name: 'Shopping', value: 470 },
      { name: 'Healthcare', value: 230 }
    ];
  }
  
  // Generate data based on category
  switch (category.toLowerCase()) {
    case 'economics':
      return [
        { name: 'East Africa', value: 8.2 },
        { name: 'West Africa', value: 6.7 },
        { name: 'North Africa', value: 4.5 },
        { name: 'Southern Africa', value: 3.2 },
        { name: 'Central Africa', value: 5.1 }
      ];
    case 'health':
      return [
        { name: 'Healthcare Access', value: 72 },
        { name: 'Infant Mortality', value: 43 },
        { name: 'Life Expectancy', value: 65 },
        { name: 'Vaccination Rate', value: 81 },
        { name: 'Healthcare Spending', value: 48 }
      ];
    case 'education':
      return [
        { name: 'Primary Enrollment', value: 92 },
        { name: 'Secondary Enrollment', value: 67 },
        { name: 'Tertiary Enrollment', value: 34 },
        { name: 'Literacy Rate', value: 76 },
        { name: 'Education Spending', value: 41 }
      ];
    default:
      return [
        { name: 'Category A', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Category B', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Category C', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Category D', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Category E', value: Math.floor(Math.random() * 500) + 100 }
      ];
  }
};

// Generate time series data for trend visualization
export const generateTimeSeriesData = (baseData: any[], category: string) => {
  // For Transaction History or financial data
  if (category.toLowerCase().includes('economics') || category.toLowerCase().includes('financial')) {
    return [
      { name: 'Jan', value: 320 },
      { name: 'Feb', value: 340 },
      { name: 'Mar', value: 380 },
      { name: 'Apr', value: 290 },
      { name: 'May', value: 430 },
      { name: 'Jun', value: 390 },
      { name: 'Jul', value: 420 },
      { name: 'Aug', value: 380 },
      { name: 'Sep', value: 410 },
      { name: 'Oct', value: 450 },
      { name: 'Nov', value: 470 },
      { name: 'Dec', value: 510 }
    ];
  }
  
  // Generate time series based on the first item from base data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    const baseValue = baseData && baseData.length > 0 ? baseData[0].value : 100;
    const randomFactor = (Math.random() * 0.4) + 0.8; // 0.8 to 1.2
    return {
      name: month,
      value: Math.round(baseValue * randomFactor)
    };
  });
};

// Generate category distribution data
export const generateCategoryData = (baseData: any[], category: string) => {
  // For Transaction History
  if (category.toLowerCase().includes('economics')) {
    return [
      { name: 'Domestic', value: 62 },
      { name: 'Export', value: 38 }
    ];
  } else if (category.toLowerCase().includes('health')) {
    return [
      { name: 'Public', value: 55 },
      { name: 'Private', value: 45 }
    ];
  } else if (category.toLowerCase().includes('education')) {
    return [
      { name: 'Urban', value: 68 },
      { name: 'Rural', value: 32 }
    ];
  }
  
  // Default distribution
  return [
    { name: 'Group A', value: 65 },
    { name: 'Group B', value: 35 }
  ];
};

// DEPRECATED: Legacy function - use calculateDataDrivenInsights instead
export const generateInsights = (data: any[], category: string, title: string) => {
  console.warn('⚠️ DEPRECATED: generateInsights() uses static templates. Use calculateDataDrivenInsights() for real analysis.');
  
  // Fallback for backward compatibility - generate basic real insights
  if (!data || data.length === 0) {
    return [`No data available for ${title}. Please upload a dataset to see real insights.`];
  }

  const insights: string[] = [];
  
  // Calculate actual statistics from the data
  const values = data.map(item => Number(item.value) || 0).filter(v => !isNaN(v) && v > 0);
  
  if (values.length === 0) {
    return [`Dataset "${title}" contains no numeric values for analysis.`];
  }

  // Real calculations
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  // Find actual highest and lowest items
  const highestItem = data.find(item => Number(item.value) === max);
  const lowestItem = data.find(item => Number(item.value) === min);
  
  // Generate real insights based on actual data
  if (highestItem) {
    insights.push(`Highest value: ${highestItem.name} (${max.toLocaleString()})`);
  }
  
  if (lowestItem && min !== max) {
    insights.push(`Lowest value: ${lowestItem.name} (${min.toLocaleString()})`);
  }
  
  insights.push(`Average value: ${average.toLocaleString(undefined, { maximumFractionDigits: 1 })}`);
  
  // Calculate percentage distribution for top item
  if (highestItem && total > 0) {
    const percentage = ((max / total) * 100).toFixed(1);
    insights.push(`${highestItem.name} represents ${percentage}% of the total`);
  }
  
  return insights.slice(0, 4); // Limit to most important insights
};
