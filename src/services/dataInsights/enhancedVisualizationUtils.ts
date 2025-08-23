
import { Dataset } from "@/types/dataset";

import { visualizationCache } from "./intelligentCache";
import { determineOptimalVisualizationType, recommendCharts } from "./smartChartSelector";

// Enhanced visualization type determination with smart recommendations
export const determineVisualizationType = (
  query: string, 
  category: string, 
  data?: any[]
): 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' => {
  // Check cache first
  const cacheKey = `viztype:${query}:${category}`;
  const cached = visualizationCache.get(cacheKey);
  if (cached && typeof cached === 'string') {
    return cached as 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map';
  }

  // Use smart chart selector if data is available
  if (data && data.length > 0) {
    const result = determineOptimalVisualizationType(query, category, data);
    visualizationCache.set(cacheKey, result);
    return result;
  }

  // Fallback to original logic for backward compatibility
  const queryLower = query.toLowerCase();
  
  // Geographic queries
  if (queryLower.includes('map') || queryLower.includes('geographic') || 
      queryLower.includes('location') || queryLower.includes('region') ||
      queryLower.includes('country') || queryLower.includes('where')) {
    visualizationCache.set(cacheKey, 'map');
    return 'map';
  }
  
  // Time series queries
  if (queryLower.includes('trend') || queryLower.includes('over time') || 
      queryLower.includes('change') || queryLower.includes('evolution') ||
      queryLower.includes('growth') || queryLower.includes('decline')) {
    visualizationCache.set(cacheKey, 'line');
    return 'line';
  }
  
  // Distribution queries
  if (queryLower.includes('distribution') || queryLower.includes('share') || 
      queryLower.includes('proportion') || queryLower.includes('percentage')) {
    visualizationCache.set(cacheKey, 'pie');
    return 'pie';
  }
  
  // Volume/area queries
  if (queryLower.includes('volume') || queryLower.includes('total') || 
      queryLower.includes('cumulative') || queryLower.includes('aggregate')) {
    visualizationCache.set(cacheKey, 'area');
    return 'area';
  }
  
  // Multi-dimensional comparison
  if (queryLower.includes('compare') || queryLower.includes('versus') || 
      queryLower.includes('performance') || queryLower.includes('score')) {
    visualizationCache.set(cacheKey, 'radar');
    return 'radar';
  }

  // Default to bar chart
  visualizationCache.set(cacheKey, 'bar');
  return 'bar';
};

// Generate enhanced comparison with multiple chart recommendations
export const generateComparison = (
  datasets: Dataset[], 
  visualizations: any[]
): any => {
  if (datasets.length < 2) return null;

  // Get recommendations for each visualization
  const enhancedVisualizations = visualizations.map(viz => {
    const recommendations = recommendCharts(viz.data, viz.category, '');
    return {
      ...viz,
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      primaryRecommendation: recommendations[0]
    };
  });

  // Find common metrics across datasets
  const commonMetrics = findCommonMetrics(visualizations);
  
  return {
    title: `Comparison across ${datasets.length} datasets`,
    description: `Comparative analysis showing relationships between ${datasets.map(d => d.title).join(', ')}`,
    data: commonMetrics,
    enhancedVisualizations,
    insights: generateComparisonInsights(datasets, commonMetrics)
  };
};

// Find metrics that exist across multiple datasets
const findCommonMetrics = (visualizations: any[]): any[] => {
  if (visualizations.length === 0) return [];

  // Extract all metric names from all visualizations
  const allMetrics = visualizations.reduce((acc, viz) => {
    if (viz.data && Array.isArray(viz.data)) {
      viz.data.forEach((item: any) => {
        if (item.name && typeof item.value === 'number') {
          acc.add(item.name.toLowerCase());
        }
      });
    }
    return acc;
  }, new Set<string>());

  // Find metrics that appear in multiple datasets
  const commonMetrics: any[] = [];
  allMetrics.forEach(metricName => {
    const dataPoints = visualizations.map((viz, index) => {
      const item = viz.data?.find((d: any) => 
        d.name?.toLowerCase() === metricName
      );
      return {
        dataset: viz.title,
        value: item?.value || 0,
        category: viz.category
      };
    }).filter(point => point.value > 0);

    if (dataPoints.length >= 2) {
      commonMetrics.push({
        name: metricName,
        dataPoints,
        variance: calculateVariance(dataPoints.map(p => p.value))
      });
    }
  });

  return commonMetrics.slice(0, 10); // Limit to top 10 for performance
};

// Calculate variance for comparison insights
const calculateVariance = (values: number[]): number => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
};

// Generate insights from comparison data
const generateComparisonInsights = (datasets: Dataset[], commonMetrics: any[]): string[] => {
  const insights: string[] = [];

  if (commonMetrics.length > 0) {
    // Find metric with highest variance
    const highVarianceMetric = commonMetrics.reduce((max, metric) => 
      metric.variance > max.variance ? metric : max
    );

    insights.push(
      `The metric "${highVarianceMetric.name}" shows the most variation across datasets, indicating significant differences in this area.`
    );

    // Find consistent metrics
    const lowVarianceMetrics = commonMetrics.filter(m => m.variance < highVarianceMetric.variance * 0.3);
    if (lowVarianceMetrics.length > 0) {
      insights.push(
        `Consistent patterns found in ${lowVarianceMetrics.length} metrics across all datasets, suggesting stable underlying trends.`
      );
    }
  }

  // Category-based insights
  const categories = [...new Set(datasets.map(d => d.category))];
  if (categories.length > 1) {
    insights.push(
      `Cross-category analysis reveals relationships between ${categories.join(' and ')} data.`
    );
  }

  return insights;
};
