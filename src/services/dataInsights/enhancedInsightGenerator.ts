
// Enhanced insight generation based on actual data analysis
export const generateDataDrivenInsights = (data: any[], category: string, query: string, title: string): string[] => {
  if (!data || data.length === 0) {
    return ['No data available for analysis.'];
  }
  
  const insights: string[] = [];
  const values = data.map(item => typeof item.value === 'number' ? item.value : 0);
  const stats = calculateStatistics(values);
  
  // Trend analysis for time series data
  if (isTimeSeriesData(data)) {
    insights.push(...generateTrendInsights(data, category, stats));
  }
  
  // Distribution analysis
  insights.push(...generateDistributionInsights(data, category, stats));
  
  // Comparative analysis
  insights.push(...generateComparativeInsights(data, category, stats));
  
  // Anomaly detection
  insights.push(...generateAnomalyInsights(data, category, stats));
  
  // Context-specific insights
  insights.push(...generateContextualInsights(data, category, query, title));
  
  return insights.slice(0, 6); // Limit to 6 most relevant insights
};

// Calculate comprehensive statistics
const calculateStatistics = (values: number[]) => {
  if (values.length === 0) return null;
  
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    stdDev,
    range: sorted[sorted.length - 1] - sorted[0],
    coefficientOfVariation: stdDev / mean,
    q1: sorted[Math.floor(sorted.length * 0.25)],
    q3: sorted[Math.floor(sorted.length * 0.75)]
  };
};

// Check if data represents time series
const isTimeSeriesData = (data: any[]): boolean => {
  return data.some(item => 
    item.timeStamp || 
    item.name?.match(/\d{4}|Q\d|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
  );
};

// Generate trend insights for time series data
const generateTrendInsights = (data: any[], category: string, stats: any): string[] => {
  const insights: string[] = [];
  
  if (data.length < 2) return insights;
  
  // Calculate trend direction
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const change = lastValue - firstValue;
  const percentChange = (change / firstValue) * 100;
  
  if (Math.abs(percentChange) > 5) {
    const direction = percentChange > 0 ? 'increased' : 'decreased';
    const formattedChange = Math.abs(percentChange).toFixed(1);
    insights.push(`The data shows a ${direction} trend of ${formattedChange}% from start to end of the period.`);
  }
  
  // Volatility analysis
  if (stats && stats.coefficientOfVariation > 0.2) {
    insights.push(`High volatility detected with significant fluctuations throughout the time period.`);
  } else if (stats && stats.coefficientOfVariation < 0.1) {
    insights.push(`The data shows remarkable stability with minimal variation over time.`);
  }
  
  // Growth acceleration/deceleration
  if (data.length >= 4) {
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.value, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.value, 0) / secondHalf.length;
    
    const accelerationChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    if (Math.abs(accelerationChange) > 10) {
      const trend = accelerationChange > 0 ? 'accelerating growth' : 'decelerating trend';
      insights.push(`The second half of the period shows ${trend} compared to the first half.`);
    }
  }
  
  return insights;
};

// Generate distribution insights
const generateDistributionInsights = (data: any[], category: string, stats: any): string[] => {
  const insights: string[] = [];
  
  if (!stats) return insights;
  
  // Identify top performers
  const topItem = data.find(item => item.value === stats.max);
  const bottomItem = data.find(item => item.value === stats.min);
  
  if (topItem && bottomItem && topItem !== bottomItem) {
    const ratio = stats.max / stats.min;
    if (ratio > 2) {
      insights.push(`${topItem.name} leads significantly with the highest value, being ${ratio.toFixed(1)}x higher than ${bottomItem.name}.`);
    }
  }
  
  // Distribution analysis
  const aboveAverage = data.filter(item => item.value > stats.mean).length;
  const belowAverage = data.filter(item => item.value < stats.mean).length;
  
  if (aboveAverage !== belowAverage) {
    const skewDirection = aboveAverage > belowAverage ? 'positively' : 'negatively';
    insights.push(`The distribution is ${skewDirection} skewed with ${aboveAverage} values above and ${belowAverage} below the average.`);
  }
  
  // Outlier detection
  const outliers = data.filter(item => 
    item.value > stats.q3 + 1.5 * (stats.q3 - stats.q1) || 
    item.value < stats.q1 - 1.5 * (stats.q3 - stats.q1)
  );
  
  if (outliers.length > 0) {
    insights.push(`${outliers.length} outlier${outliers.length > 1 ? 's' : ''} detected: ${outliers.map(o => o.name).join(', ')}.`);
  }
  
  return insights;
};

// Generate comparative insights
const generateComparativeInsights = (data: any[], category: string, stats: any): string[] => {
  const insights: string[] = [];
  
  if (!stats || data.length < 3) return insights;
  
  // Top 3 analysis
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const top3 = sortedData.slice(0, 3);
  const top3Total = top3.reduce((sum, item) => sum + item.value, 0);
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const top3Percentage = (top3Total / totalValue) * 100;
  
  if (top3Percentage > 50 && data.length > 5) {
    insights.push(`The top 3 categories (${top3.map(item => item.name).join(', ')}) account for ${top3Percentage.toFixed(1)}% of the total.`);
  }
  
  // Gap analysis
  if (data.length >= 2) {
    const largest = sortedData[0];
    const secondLargest = sortedData[1];
    const gap = ((largest.value - secondLargest.value) / secondLargest.value) * 100;
    
    if (gap > 25) {
      insights.push(`There's a significant ${gap.toFixed(1)}% gap between the top performer (${largest.name}) and second place (${secondLargest.name}).`);
    }
  }
  
  return insights;
};

// Generate anomaly insights
const generateAnomalyInsights = (data: any[], category: string, stats: any): string[] => {
  const insights: string[] = [];
  
  if (!stats) return insights;
  
  // Identify potential anomalies based on z-score
  const anomalies = data.filter(item => {
    const zScore = Math.abs((item.value - stats.mean) / stats.stdDev);
    return zScore > 2; // More than 2 standard deviations
  });
  
  if (anomalies.length > 0) {
    const anomalyNames = anomalies.map(a => a.name).join(', ');
    insights.push(`Potential anomalies detected in: ${anomalyNames}, showing values significantly different from the norm.`);
  }
  
  // Check for clustering patterns
  const clusters = identifyClusters(data, stats);
  if (clusters.length > 1) {
    insights.push(`Data shows ${clusters.length} distinct clusters, suggesting different performance groups or categories.`);
  }
  
  return insights;
};

// Generate context-specific insights based on category and query
const generateContextualInsights = (data: any[], category: string, query: string, title: string): string[] => {
  const insights: string[] = [];
  const categoryLower = category.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Economic context
  if (categoryLower.includes('economic')) {
    if (queryLower.includes('growth')) {
      const avgGrowth = data.reduce((sum, item) => sum + item.value, 0) / data.length;
      if (avgGrowth > 5) {
        insights.push('Strong economic growth indicators suggest a robust and expanding economy.');
      } else if (avgGrowth < 2) {
        insights.push('Economic growth appears modest, indicating potential challenges or mature market conditions.');
      }
    }
  }
  
  // Health context
  if (categoryLower.includes('health')) {
    const maxValue = Math.max(...data.map(item => item.value));
    if (queryLower.includes('rate') && maxValue < 50) {
      insights.push('Health metrics indicate areas requiring significant improvement and targeted interventions.');
    }
  }
  
  // Education context
  if (categoryLower.includes('education')) {
    const avgValue = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    if (avgValue > 80) {
      insights.push('Education metrics show strong performance across multiple indicators.');
    }
  }
  
  return insights;
};

// Simple clustering algorithm to identify data groups
const identifyClusters = (data: any[], stats: any): any[][] => {
  if (!stats || data.length < 4) return [data];
  
  const clusters: any[][] = [];
  const threshold = stats.stdDev * 0.5;
  
  let currentCluster: any[] = [data[0]];
  
  for (let i = 1; i < data.length; i++) {
    const prevValue = data[i - 1].value;
    const currentValue = data[i].value;
    
    if (Math.abs(currentValue - prevValue) <= threshold) {
      currentCluster.push(data[i]);
    } else {
      if (currentCluster.length > 1) {
        clusters.push(currentCluster);
      }
      currentCluster = [data[i]];
    }
  }
  
  if (currentCluster.length > 1) {
    clusters.push(currentCluster);
  }
  
  return clusters.length > 1 ? clusters : [data];
};
