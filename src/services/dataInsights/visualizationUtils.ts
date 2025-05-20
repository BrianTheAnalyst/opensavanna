
// Determine the best visualization type based on the query and category
export const determineVisualizationType = (query: string, category: string): 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' => {
  const queryLower = query.toLowerCase();
  
  // Enhanced geo detection - look for more location-related keywords
  const geoKeywords = ['map', 'location', 'where', 'place', 'region', 'country', 
                      'city', 'area', 'geographic', 'spatial', 'territory', 'world'];
  
  if (geoKeywords.some(keyword => queryLower.includes(keyword))) {
    return 'map';
  }
  
  // Enhanced time series detection - look for trends, time-related keywords
  const timeSeriesKeywords = ['trend', 'time', 'over time', 'historical', 'projection', 
                             'forecast', 'predict', 'future', 'timeline', 'evolution', 
                             'progress', 'growth', 'decline', 'change', 'development'];
                             
  if (timeSeriesKeywords.some(keyword => queryLower.includes(keyword))) {
    return 'line';
  }
  
  if (queryLower.includes('comparison') || queryLower.includes('compare') || queryLower.includes('versus') || queryLower.includes('vs')) {
    return 'bar';
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
      return queryLower.includes('time') || queryLower.includes('trend') ? 'line' : 'bar';
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

// Generate a comparison between datasets if multiple are available
export const generateComparison = (datasets: any[], visualizations: any[]): { title: string; description: string; data: any[] } => {
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

// Generate time series data for visualizations
export const generateTimeSeriesData = (query: string, baseData: any[]): any[] => {
  // If we already have time-based data with proper formatting, use it
  if (baseData.some(item => item.name && (typeof item.name === 'string') && 
      (item.name.includes('Q') || /^\d{4}$/.test(item.name) || 
       ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(item.name)))) {
    return baseData;
  }
  
  // Generate time periods (months or quarters) for the current and next year
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // Determine if we should use quarters or months based on the query
  const useQuarters = query.toLowerCase().includes('quarter') || query.toLowerCase().includes('quarterly');
  
  if (useQuarters) {
    // Generate quarterly data
    return [
      { name: `Q1 ${currentYear}`, value: Math.floor(Math.random() * 150 + 100) },
      { name: `Q2 ${currentYear}`, value: Math.floor(Math.random() * 150 + 110) },
      { name: `Q3 ${currentYear}`, value: Math.floor(Math.random() * 150 + 120) },
      { name: `Q4 ${currentYear}`, value: Math.floor(Math.random() * 150 + 130) },
      { name: `Q1 ${nextYear}`, value: Math.floor(Math.random() * 150 + 140) },
      { name: `Q2 ${nextYear}`, value: Math.floor(Math.random() * 150 + 150) },
      { name: `Q3 ${nextYear}`, value: Math.floor(Math.random() * 150 + 160) },
      { name: `Q4 ${nextYear}`, value: Math.floor(Math.random() * 150 + 170) }
    ];
  } else {
    // Generate monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create data for current year
    const currentYearData = months.map((month, index) => ({
      name: `${month} ${currentYear}`,
      value: Math.floor(Math.random() * 100 + 100 + (index * 5))
    }));
    
    // Create data for next year (for projections)
    const nextYearData = months.slice(0, 6).map((month, index) => ({
      name: `${month} ${nextYear}`,
      value: Math.floor(Math.random() * 100 + 150 + (index * 8)),
      projected: true
    }));
    
    return [...currentYearData, ...nextYearData];
  }
};
