
/**
 * Pattern detection service for data insights
 * Detects patterns, anomalies, and trends in visualization data
 */

interface PatternResult {
  type: 'trend' | 'anomaly' | 'comparison' | 'distribution';
  description: string;
  strength: number; // 0-1 representing confidence in pattern
}

/**
 * Detect meaningful patterns in the data
 * @param data Visualization data
 * @param category Dataset category
 * @returns Array of insight strings 
 */
export const detectPatterns = (data: any[], category: string): string[] => {
  const insights: string[] = [];
  
  if (!data || data.length === 0) return insights;
  
  // Run different pattern detectors based on data structure and category
  const trendPatterns = detectTrends(data);
  if (trendPatterns.length > 0) {
    insights.push(...trendPatterns.map(p => p.description));
  }
  
  const anomalyPatterns = detectAnomalies(data);
  if (anomalyPatterns.length > 0) {
    insights.push(...anomalyPatterns.map(p => p.description));
  }
  
  const distributionPatterns = detectDistributionPattern(data, category);
  if (distributionPatterns.length > 0) {
    insights.push(...distributionPatterns.map(p => p.description));
  }
  
  return insights;
};

/**
 * Detect trends in time-series or ordered data
 */
const detectTrends = (data: any[]): PatternResult[] => {
  const results: PatternResult[] = [];
  
  // Skip if too little data
  if (data.length < 3) return results;
  
  // Check if data has names that look like dates or times
  const potentialTimeSeriesData = data.some(item => {
    const name = String(item.name || '').toLowerCase();
    return name.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20\d\d|q[1-4]|quarter|year)/i);
  });
  
  if (potentialTimeSeriesData) {
    // Sort data if it seems like a time series
    const sortedData = [...data];
    
    // Find if there's a consistent increase or decrease trend
    let increases = 0;
    let decreases = 0;
    
    for (let i = 1; i < sortedData.length; i++) {
      const diff = sortedData[i].value - sortedData[i-1].value;
      if (diff > 0) increases++;
      else if (diff < 0) decreases++;
    }
    
    // Calculate percentage of consistent direction
    const totalChanges = increases + decreases;
    if (totalChanges === 0) return results;
    
    const increaseRatio = increases / totalChanges;
    const decreaseRatio = decreases / totalChanges;
    
    // If there's a strong trend in one direction
    if (increaseRatio > 0.7) {
      results.push({
        type: 'trend',
        description: `There's a steady increasing trend across the time period, with ${Math.round(increaseRatio * 100)}% of changes showing growth.`,
        strength: increaseRatio
      });
    } else if (decreaseRatio > 0.7) {
      results.push({
        type: 'trend',
        description: `There's a consistent decreasing trend across the time period, with ${Math.round(decreaseRatio * 100)}% of changes showing decline.`,
        strength: decreaseRatio
      });
    } else if (increases > 0 && decreases > 0) {
      results.push({
        type: 'trend',
        description: `The data shows a mixed trend with both increases and decreases, indicating potential volatility or seasonal effects.`,
        strength: 0.6
      });
    }
  }
  
  return results;
};

/**
 * Detect anomalies or outliers in the data
 */
const detectAnomalies = (data: any[]): PatternResult[] => {
  const results: PatternResult[] = [];
  
  // Skip if too little data
  if (data.length < 4) return results;
  
  // Extract values
  const values = data.map(item => typeof item.value === 'number' ? item.value : 0);
  
  // Calculate mean and standard deviation
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  // Find outliers (more than 2 standard deviations from mean)
  const outliers = data.filter(item => 
    Math.abs(item.value - mean) > 2 * stdDev
  );
  
  if (outliers.length > 0) {
    // Get the most extreme outlier
    const extremeOutlier = outliers.reduce((prev, current) => 
      Math.abs(current.value - mean) > Math.abs(prev.value - mean) ? current : prev
    , outliers[0]);
    
    const isHigh = extremeOutlier.value > mean;
    const deviationAmount = Math.abs(extremeOutlier.value - mean) / stdDev;
    const deviationText = deviationAmount > 3 ? "significant" : "notable";
    
    results.push({
      type: 'anomaly',
      description: `${extremeOutlier.name} shows a ${deviationText} ${isHigh ? 'spike' : 'drop'} compared to other data points, deviating by ${deviationAmount.toFixed(1)} standard deviations from the average.`,
      strength: Math.min(deviationAmount / 5, 0.9) // Normalize to 0-0.9 scale
    });
  }
  
  return results;
};

/**
 * Detect distribution patterns 
 */
const detectDistributionPattern = (data: any[], category: string): PatternResult[] => {
  const results: PatternResult[] = [];
  
  if (data.length < 3) return results;
  
  // Sort data by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Check for Pareto-like distribution (80/20 rule)
  const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0);
  let cumulativeValue = 0;
  let dominantCount = 0;
  
  // Find how many items make up 80% of the total
  for (const item of sortedData) {
    cumulativeValue += item.value;
    dominantCount++;
    if (cumulativeValue / totalValue > 0.8) break;
  }
  
  const dominantPercentage = (dominantCount / sortedData.length) * 100;
  
  // If a small percentage of items make up 80% of value
  if (dominantPercentage <= 33) {
    const topItems = sortedData.slice(0, dominantCount);
    const topItemsText = topItems.length === 1 
      ? `"${topItems[0].name}"`
      : `the top ${topItems.length} items (${topItems.map(i => i.name).slice(0, 2).join(', ')}${topItems.length > 2 ? '...' : ''})`;
    
    results.push({
      type: 'distribution',
      description: `There's a significant concentration in the data, with ${topItemsText} accounting for 80% of the total value, following a Pareto-like distribution.`,
      strength: 0.8
    });
  }
  
  // Check for even distribution
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  const avgValue = totalValue / data.length;
  
  // Calculate variance
  const variance = data.reduce((sum, item) => 
    sum + Math.pow(item.value - avgValue, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / avgValue);
  
  if (coefficientOfVariation < 0.15) {
    results.push({
      type: 'distribution',
      description: `The data shows a remarkably even distribution across ${category}, with minimal variation between different items.`,
      strength: 0.7
    });
  }
  
  return results;
};
