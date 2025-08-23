/**
 * Calculate Real Data-Driven Insights - Medium-Term Fix
 * Replace static templates with actual statistical analysis
 */

export interface StatisticalInsight {
  type: 'statistical' | 'trend' | 'outlier' | 'distribution';
  description: string;
  confidence: number;
  significance: number;
  data: any;
}

/**
 * Generate real insights based on data analysis
 */
export const calculateDataDrivenInsights = (
  data: any[], 
  category: string, 
  title: string
): StatisticalInsight[] => {
  if (!data || data.length === 0) {
    return [{
      type: 'statistical',
      description: 'Insufficient data available for statistical analysis',
      confidence: 0,
      significance: 0,
      data: null
    }];
  }

  const insights: StatisticalInsight[] = [];
  
  // Calculate basic statistics
  const values = extractNumericValues(data);
  if (values.length > 0) {
    const stats = calculateBasicStatistics(values, data);
    insights.push(...generateStatisticalInsights(stats, data));
  }

  // Detect trends if data appears temporal
  const trendInsights = detectTrends(data);
  insights.push(...trendInsights);

  // Find outliers
  const outlierInsights = findOutliers(data, values);
  insights.push(...outlierInsights);

  // Analyze distribution
  const distributionInsights = analyzeDistribution(data, values);
  insights.push(...distributionInsights);

  // Sort by significance and return top insights
  return insights
    .filter(insight => insight.confidence > 30)
    .sort((a, b) => b.significance - a.significance)
    .slice(0, 5);
};

/**
 * Extract numeric values from data
 */
const extractNumericValues = (data: any[]): number[] => {
  const values: number[] = [];
  
  data.forEach(item => {
    // Try different common value fields
    const possibleValues = [item.value, item.count, item.amount, item.total, item.score];
    
    for (const val of possibleValues) {
      if (typeof val === 'number' && !isNaN(val)) {
        values.push(val);
        break;
      }
    }
  });
  
  return values;
};

/**
 * Calculate comprehensive statistics
 */
const calculateBasicStatistics = (values: number[], data: any[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  
  // Calculate variance and standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate percentiles
  const median = calculateMedian(sorted);
  const q1 = calculatePercentile(sorted, 25);
  const q3 = calculatePercentile(sorted, 75);
  
  return {
    count: values.length,
    sum,
    mean,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    range: sorted[sorted.length - 1] - sorted[0],
    stdDev,
    variance,
    q1,
    q3,
    iqr: q3 - q1,
    coefficientOfVariation: stdDev / mean,
    skewness: calculateSkewness(values, mean, stdDev)
  };
};

/**
 * Generate statistical insights from calculated stats
 */
const generateStatisticalInsights = (stats: any, data: any[]): StatisticalInsight[] => {
  const insights: StatisticalInsight[] = [];
  
  // Find highest and lowest values
  const maxItem = data.find(item => 
    (item.value || item.count || item.amount) === stats.max
  );
  const minItem = data.find(item => 
    (item.value || item.count || item.amount) === stats.min
  );

  if (maxItem) {
    insights.push({
      type: 'statistical',
      description: `Highest value: ${maxItem.name || 'Unknown'} (${stats.max.toLocaleString()})`,
      confidence: 95,
      significance: 0.9,
      data: { item: maxItem, value: stats.max }
    });
  }

  if (minItem && stats.max !== stats.min) {
    insights.push({
      type: 'statistical',
      description: `Lowest value: ${minItem.name || 'Unknown'} (${stats.min.toLocaleString()})`,
      confidence: 95,
      significance: 0.8,
      data: { item: minItem, value: stats.min }
    });
  }

  // Average insight
  insights.push({
    type: 'statistical',
    description: `Average value: ${stats.mean.toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
    confidence: 90,
    significance: 0.7,
    data: { mean: stats.mean }
  });

  // Variability insight
  if (stats.coefficientOfVariation > 0.3) {
    insights.push({
      type: 'statistical',
      description: `High variability detected (CV: ${(stats.coefficientOfVariation * 100).toFixed(1)}%) - values show significant spread`,
      confidence: 85,
      significance: 0.8,
      data: { cv: stats.coefficientOfVariation }
    });
  } else if (stats.coefficientOfVariation < 0.15) {
    insights.push({
      type: 'statistical',
      description: `Low variability detected (CV: ${(stats.coefficientOfVariation * 100).toFixed(1)}%) - values are relatively consistent`,
      confidence: 85,
      significance: 0.6,
      data: { cv: stats.coefficientOfVariation }
    });
  }

  return insights;
};

/**
 * Detect trend patterns in data
 */
const detectTrends = (data: any[]): StatisticalInsight[] => {
  if (data.length < 3) return [];

  const insights: StatisticalInsight[] = [];
  
  // Check if data has time-like ordering
  const hasTimePattern = data.some(item => {
    const name = String(item.name || '').toLowerCase();
    return /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20\d\d|q[1-4]|week|month|year)/.test(name);
  });

  if (hasTimePattern) {
    const values = extractNumericValues(data);
    if (values.length >= 3) {
      const trendAnalysis = analyzeTrend(values);
      
      if (Math.abs(trendAnalysis.slope) > 0.1) {
        const direction = trendAnalysis.slope > 0 ? 'increasing' : 'decreasing';
        const strength = Math.abs(trendAnalysis.correlation) > 0.7 ? 'strong' : 'moderate';
        
        insights.push({
          type: 'trend',
          description: `${strength} ${direction} trend detected (R² = ${(trendAnalysis.rSquared * 100).toFixed(1)}%)`,
          confidence: Math.round(Math.abs(trendAnalysis.correlation) * 100),
          significance: Math.abs(trendAnalysis.correlation),
          data: trendAnalysis
        });
      }
    }
  }

  return insights;
};

/**
 * Find statistical outliers
 */
const findOutliers = (data: any[], values: number[]): StatisticalInsight[] => {
  if (values.length < 4) return [];

  const insights: StatisticalInsight[] = [];
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = calculatePercentile(sorted, 25);
  const q3 = calculatePercentile(sorted, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = data.filter(item => {
    const value = item.value || item.count || item.amount;
    return typeof value === 'number' && (value < lowerBound || value > upperBound);
  });

  if (outliers.length > 0) {
    const extremeOutlier = outliers.reduce((prev, current) => {
      const prevVal = prev.value || prev.count || prev.amount || 0;
      const currVal = current.value || current.count || current.amount || 0;
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      
      return Math.abs(currVal - mean) > Math.abs(prevVal - mean) ? current : prev;
    });

    const extremeValue = extremeOutlier.value || extremeOutlier.count || extremeOutlier.amount;
    insights.push({
      type: 'outlier',
      description: `Outlier detected: ${extremeOutlier.name} (${extremeValue.toLocaleString()}) significantly differs from typical values`,
      confidence: 80,
      significance: 0.7,
      data: { outlier: extremeOutlier, value: extremeValue }
    });
  }

  return insights;
};

/**
 * Analyze data distribution patterns
 */
const analyzeDistribution = (data: any[], values: number[]): StatisticalInsight[] => {
  if (values.length < 3) return [];

  const insights: StatisticalInsight[] = [];
  const totalSum = values.reduce((a, b) => a + b, 0);
  
  // Check for Pareto distribution (80/20 rule)
  const sortedData = data
    .map(item => ({
      ...item,
      numericValue: item.value || item.count || item.amount || 0
    }))
    .sort((a, b) => b.numericValue - a.numericValue);

  let cumulativeSum = 0;
  let itemsFor80Percent = 0;
  
  for (const item of sortedData) {
    cumulativeSum += item.numericValue;
    itemsFor80Percent++;
    if (cumulativeSum / totalSum >= 0.8) break;
  }

  const percentageFor80 = (itemsFor80Percent / sortedData.length) * 100;
  
  if (percentageFor80 <= 30) {
    insights.push({
      type: 'distribution',
      description: `Pareto distribution detected: ${percentageFor80.toFixed(0)}% of items account for 80% of total value`,
      confidence: 85,
      significance: 0.8,
      data: { paretoPercentage: percentageFor80 }
    });
  }

  return insights;
};

// Helper functions
const calculateMedian = (sorted: number[]): number => {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

const calculatePercentile = (sorted: number[], percentile: number): number => {
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) return sorted[lower];
  
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

const calculateSkewness = (values: number[], mean: number, stdDev: number): number => {
  const n = values.length;
  const skewness = values.reduce((sum, value) => {
    return sum + Math.pow((value - mean) / stdDev, 3);
  }, 0) / n;
  
  return skewness;
};

const analyzeTrend = (values: number[]) => {
  const n = values.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  
  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  
  const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0);
  const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Calculate correlation coefficient
  const xStdDev = Math.sqrt(xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0) / n);
  const yStdDev = Math.sqrt(values.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0) / n);
  const correlation = numerator / (n * xStdDev * yStdDev);
  
  return {
    slope,
    intercept,
    correlation,
    rSquared: Math.pow(correlation, 2)
  };
};