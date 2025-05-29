
import { DataParseResult, ParsedDataPoint } from './dataParser';
import { SmartVisualization } from './visualizationGenerator';

export const generateAdvancedInsights = (
  parseResult: DataParseResult,
  visualizations: SmartVisualization[],
  category: string,
  query: string = ''
): string[] => {
  const insights: string[] = [];
  const { data, summary, numericColumns, categoricalColumns, dateColumns, totalRows } = parseResult;

  // Data Quality Insights
  insights.push(...generateDataQualityInsights(parseResult));

  // Statistical Insights
  if (numericColumns.length > 0) {
    insights.push(...generateStatisticalInsights(data, numericColumns, summary));
  }

  // Pattern Recognition
  insights.push(...generatePatternInsights(data, parseResult));

  // Category-Specific Insights
  insights.push(...generateCategorySpecificInsights(data, parseResult, category));

  // Query-Specific Insights
  if (query) {
    insights.push(...generateQuerySpecificInsights(data, parseResult, query));
  }

  // Anomaly Detection
  insights.push(...generateAnomalyInsights(data, numericColumns));

  return insights.slice(0, 12); // Return top 12 most relevant insights
};

const generateDataQualityInsights = (parseResult: DataParseResult): string[] => {
  const { summary, totalRows, columns } = parseResult;
  const insights: string[] = [];

  const totalNulls = Object.values(summary).reduce((sum, col) => sum + col.nullCount, 0);
  const nullPercentage = (totalNulls / (totalRows * columns.length)) * 100;

  if (nullPercentage < 5) {
    insights.push("Excellent data quality with minimal missing values");
  } else if (nullPercentage < 15) {
    insights.push("Good data quality with some missing values to consider");
  } else {
    insights.push(`Data quality concerns: ${nullPercentage.toFixed(1)}% missing values detected`);
  }

  const highVariabilityColumns = Object.entries(summary)
    .filter(([_, col]) => col.type === 'categorical' && col.uniqueValues && col.uniqueValues > totalRows * 0.5)
    .map(([name, _]) => name);

  if (highVariabilityColumns.length > 0) {
    insights.push(`High diversity in ${highVariabilityColumns.join(', ')} suggests rich categorical data`);
  }

  return insights;
};

const generateStatisticalInsights = (
  data: ParsedDataPoint[],
  numericColumns: string[],
  summary: DataParseResult['summary']
): string[] => {
  const insights: string[] = [];

  numericColumns.forEach(column => {
    const colSummary = summary[column];
    if (colSummary?.type === 'numeric' && colSummary.min !== undefined && colSummary.max !== undefined) {
      const range = colSummary.max - colSummary.min;
      const mean = colSummary.mean || 0;
      
      if (range > mean * 10) {
        insights.push(`${column} shows extreme variation with outliers significantly affecting the range`);
      }
      
      if (colSummary.min < 0 && colSummary.max > 0) {
        insights.push(`${column} contains both positive and negative values, suggesting diverse data points`);
      }

      // Detect potential power law or exponential distributions
      const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val) && val > 0);
      if (values.length > 10) {
        const logValues = values.map(val => Math.log(val));
        const stdDev = Math.sqrt(logValues.reduce((sum, val) => {
          const logMean = logValues.reduce((s, v) => s + v, 0) / logValues.length;
          return sum + Math.pow(val - logMean, 2);
        }, 0) / logValues.length);
        
        if (stdDev < 1.5) {
          insights.push(`${column} may follow a log-normal distribution, suggesting multiplicative processes`);
        }
      }
    }
  });

  return insights;
};

const generatePatternInsights = (data: ParsedDataPoint[], parseResult: DataParseResult): string[] => {
  const insights: string[] = [];
  const { numericColumns, categoricalColumns, dateColumns } = parseResult;

  // Seasonal pattern detection for time series
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const dateCol = dateColumns[0];
    const numCol = numericColumns[0];
    
    const monthlyData = data.reduce((acc, row) => {
      try {
        const date = new Date(row[dateCol]);
        const month = date.getMonth();
        const value = parseFloat(row[numCol]);
        
        if (!isNaN(value) && !isNaN(month)) {
          if (!acc[month]) acc[month] = [];
          acc[month].push(value);
        }
      } catch (e) {
        // Skip invalid dates
      }
      return acc;
    }, {} as any);

    const monthlyAvgs = Object.entries(monthlyData)
      .map(([month, values]: [string, any]) => ({
        month: parseInt(month),
        avg: values.reduce((sum: number, val: number) => sum + val, 0) / values.length
      }))
      .sort((a, b) => a.month - b.month);

    if (monthlyAvgs.length >= 6) {
      const maxMonthAvg = Math.max(...monthlyAvgs.map(m => m.avg));
      const minMonthAvg = Math.min(...monthlyAvgs.map(m => m.avg));
      
      if ((maxMonthAvg - minMonthAvg) / minMonthAvg > 0.3) {
        const maxMonth = monthlyAvgs.find(m => m.avg === maxMonthAvg)?.month;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        insights.push(`Seasonal pattern detected with peak values in ${monthNames[maxMonth || 0]}`);
      }
    }
  }

  // Correlation patterns between categorical and numeric
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    const catCol = categoricalColumns[0];
    const numCol = numericColumns[0];
    
    const categoryStats = data.reduce((acc, row) => {
      const category = String(row[catCol]);
      const value = parseFloat(row[numCol]);
      
      if (!isNaN(value)) {
        if (!acc[category]) acc[category] = [];
        acc[category].push(value);
      }
      return acc;
    }, {} as any);

    const categoryAvgs = Object.entries(categoryStats)
      .map(([cat, values]: [string, any]) => ({
        category: cat,
        avg: values.reduce((sum: number, val: number) => sum + val, 0) / values.length,
        count: values.length
      }))
      .filter(item => item.count >= 3)
      .sort((a, b) => b.avg - a.avg);

    if (categoryAvgs.length >= 3) {
      const topCategory = categoryAvgs[0];
      const bottomCategory = categoryAvgs[categoryAvgs.length - 1];
      const ratio = topCategory.avg / bottomCategory.avg;
      
      if (ratio > 2) {
        insights.push(`Strong category effect: ${topCategory.category} averages ${ratio.toFixed(1)}x higher ${numCol} than ${bottomCategory.category}`);
      }
    }
  }

  return insights;
};

const generateCategorySpecificInsights = (
  data: ParsedDataPoint[],
  parseResult: DataParseResult,
  category: string
): string[] => {
  const insights: string[] = [];
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('economic')) {
    const growthColumns = parseResult.columns.filter(col => 
      col.toLowerCase().includes('growth') || col.toLowerCase().includes('gdp') || col.toLowerCase().includes('rate')
    );
    
    if (growthColumns.length > 0) {
      const values = data.map(row => parseFloat(row[growthColumns[0]])).filter(val => !isNaN(val));
      const avgGrowth = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      if (avgGrowth > 5) {
        insights.push("Strong economic performance indicated by above-average growth metrics");
      } else if (avgGrowth < 0) {
        insights.push("Economic contraction patterns detected in the data");
      }
    }
  }

  if (categoryLower.includes('health')) {
    const rateColumns = parseResult.columns.filter(col => 
      col.toLowerCase().includes('rate') || col.toLowerCase().includes('mortality') || col.toLowerCase().includes('incidence')
    );
    
    if (rateColumns.length > 0) {
      insights.push("Health metrics suggest need for targeted intervention strategies");
    }
  }

  if (categoryLower.includes('education')) {
    const performanceColumns = parseResult.columns.filter(col => 
      col.toLowerCase().includes('score') || col.toLowerCase().includes('rate') || col.toLowerCase().includes('percent')
    );
    
    if (performanceColumns.length > 0) {
      const values = data.map(row => parseFloat(row[performanceColumns[0]])).filter(val => !isNaN(val));
      const avgPerformance = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      if (avgPerformance > 80) {
        insights.push("Education metrics indicate strong performance across measured indicators");
      }
    }
  }

  return insights;
};

const generateQuerySpecificInsights = (
  data: ParsedDataPoint[],
  parseResult: DataParseResult,
  query: string
): string[] => {
  const insights: string[] = [];
  const queryLower = query.toLowerCase();

  if (queryLower.includes('trend')) {
    if (parseResult.dateColumns.length > 0) {
      insights.push("Temporal data available for comprehensive trend analysis");
    } else {
      insights.push("Limited temporal information available for trend analysis");
    }
  }

  if (queryLower.includes('compare')) {
    if (parseResult.categoricalColumns.length > 0) {
      insights.push(`Comparison possible across ${parseResult.categoricalColumns.length} categorical dimensions`);
    }
  }

  if (queryLower.includes('correlation') || queryLower.includes('relationship')) {
    if (parseResult.numericColumns.length >= 2) {
      insights.push(`${parseResult.numericColumns.length} numeric variables available for correlation analysis`);
    }
  }

  return insights;
};

const generateAnomalyInsights = (data: ParsedDataPoint[], numericColumns: string[]): string[] => {
  const insights: string[] = [];

  numericColumns.forEach(column => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    if (values.length < 10) return;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    const outliers = values.filter(val => Math.abs(val - mean) > 2 * stdDev);
    const outlierPercentage = (outliers.length / values.length) * 100;

    if (outlierPercentage > 5) {
      insights.push(`${column} contains ${outlierPercentage.toFixed(1)}% outliers, suggesting data anomalies or special cases`);
    } else if (outlierPercentage > 0) {
      insights.push(`${column} shows ${outliers.length} potential outliers worth investigating`);
    }
  });

  return insights;
};
