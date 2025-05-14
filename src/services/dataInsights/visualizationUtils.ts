
// Determine the best visualization type based on the query and category
export const determineVisualizationType = (query: string, category: string): 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' => {
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
