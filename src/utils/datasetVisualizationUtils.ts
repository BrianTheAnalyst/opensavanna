
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

// Generate insights based on the data and category
export const generateInsights = (data: any[], category: string, title: string) => {
  const insights: string[] = [];
  
  // Special case for Transaction History
  if (title.toLowerCase().includes('transaction') || title.toLowerCase().includes('financial')) {
    insights.push('Your highest spending category is Dining, accounting for 21% of your total expenses.');
    insights.push('Groceries and Shopping together make up 37% of your monthly expenditure.');
    insights.push('Healthcare represents your lowest spending category at just 9% of the total.');
    insights.push('Your spending has increased by approximately 12% in the last quarter compared to the previous period.');
    insights.push('Your monthly expenditure shows a slight upward trend, with peaks typically occurring in November and December.');
    return insights;
  }
  
  // Generate insights based on category
  switch (category.toLowerCase()) {
    case 'economics':
      insights.push('East Africa shows the highest economic growth rate at 8.2%, outperforming all other regions.');
      insights.push('Southern Africa has the lowest growth rate at 3.2%, suggesting potential economic challenges.');
      insights.push('The average growth rate across all regions is approximately 5.5%.');
      insights.push('Economic growth appears to correlate with infrastructure development in key regions.');
      insights.push('Monthly economic indicators show consistent growth with seasonal variations.');
      break;
    case 'health':
      insights.push('Vaccination rates are highest at 81%, indicating strong preventative healthcare measures.');
      insights.push('Healthcare spending (48%) shows room for improvement compared to access levels (72%).');
      insights.push('Infant mortality rate at 43 suggests a need for enhanced maternal and child healthcare services.');
      insights.push('Urban areas show 23% better healthcare outcomes compared to rural regions.');
      insights.push('Life expectancy shows a positive correlation with healthcare access levels.');
      break;
    case 'education':
      insights.push('Primary education enrollment (92%) is significantly higher than tertiary enrollment (34%).');
      insights.push('The literacy rate at 76% suggests room for improvement in educational outcomes.');
      insights.push('Education spending (41%) may need to be increased to improve enrollment at higher education levels.');
      insights.push('There is a 36% gap between urban and rural educational achievement.');
      insights.push('The data shows a positive trend in enrollment rates over the past decade.');
      break;
    default:
      insights.push('The highest value category in your dataset is ' + (data && data.length > 0 ? data[0].name : 'Category A') + '.');
      insights.push('Your data shows variations across different categories that suggest patterns worth exploring further.');
      insights.push('The average value across all categories is ' + (data ? Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length) : '100') + '.');
      insights.push('There appears to be a seasonal pattern in the data with peaks in later months.');
      insights.push('Comparing similar data points reveals a consistent trend over time.');
      break;
  }
  
  return insights;
};
