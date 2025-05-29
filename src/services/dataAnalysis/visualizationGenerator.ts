
import { DataParseResult, ParsedDataPoint } from './dataParser';

export interface SmartVisualization {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'map';
  data: any[];
  category: string;
  insights: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  description: string;
}

export const generateSmartVisualizations = (
  parseResult: DataParseResult,
  category: string,
  query: string = ''
): SmartVisualization[] => {
  const visualizations: SmartVisualization[] = [];
  const { data, numericColumns, categoricalColumns, dateColumns, summary } = parseResult;

  // 1. Time Series Analysis (if date columns exist)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const timeSeriesViz = createTimeSeriesVisualization(data, dateColumns[0], numericColumns, category);
    if (timeSeriesViz) visualizations.push(timeSeriesViz);
  }

  // 2. Distribution Analysis for numeric columns
  if (numericColumns.length > 0) {
    const distributionViz = createDistributionVisualization(data, numericColumns, categoricalColumns, category);
    if (distributionViz) visualizations.push(distributionViz);
  }

  // 3. Categorical Analysis
  if (categoricalColumns.length > 0) {
    const categoricalViz = createCategoricalVisualization(data, categoricalColumns, numericColumns, category);
    if (categoricalViz) visualizations.push(categoricalViz);
  }

  // 4. Correlation Analysis (if multiple numeric columns)
  if (numericColumns.length >= 2) {
    const correlationViz = createCorrelationVisualization(data, numericColumns, category);
    if (correlationViz) visualizations.push(correlationViz);
  }

  // 5. Geographic visualization (if geographic indicators found)
  const geoViz = createGeographicVisualization(data, parseResult, category);
  if (geoViz) visualizations.push(geoViz);

  return visualizations.slice(0, 4); // Limit to 4 most relevant visualizations
};

const createTimeSeriesVisualization = (
  data: ParsedDataPoint[],
  dateColumn: string,
  numericColumns: string[],
  category: string
): SmartVisualization | null => {
  try {
    // Sort by date and aggregate data
    const timeSeriesData = data
      .map(row => ({
        date: new Date(row[dateColumn]),
        ...numericColumns.reduce((acc, col) => {
          acc[col] = parseFloat(row[col]) || 0;
          return acc;
        }, {} as any)
      }))
      .filter(row => !isNaN(row.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(row => ({
        name: row.date.toLocaleDateString(),
        value: row[numericColumns[0]], // Primary metric
        date: row.date,
        ...numericColumns.reduce((acc, col) => {
          acc[col] = row[col];
          return acc;
        }, {} as any)
      }));

    if (timeSeriesData.length < 2) return null;

    // Calculate trend
    const values = timeSeriesData.map(d => d.value);
    const trend = calculateTrend(values);
    const insights = [
      `Time series shows ${trend > 0 ? 'upward' : trend < 0 ? 'downward' : 'stable'} trend over time`,
      `Data spans ${timeSeriesData.length} time periods`,
      `${trend > 5 ? 'Strong growth' : trend < -5 ? 'Significant decline' : 'Moderate changes'} observed`
    ];

    return {
      id: 'timeseries',
      title: `${numericColumns[0]} Over Time`,
      type: 'line',
      data: timeSeriesData,
      category,
      insights,
      xAxisLabel: 'Time Period',
      yAxisLabel: numericColumns[0],
      description: `Temporal analysis of ${numericColumns[0]} showing trends and patterns over time`
    };
  } catch (error) {
    console.error('Error creating time series visualization:', error);
    return null;
  }
};

const createDistributionVisualization = (
  data: ParsedDataPoint[],
  numericColumns: string[],
  categoricalColumns: string[],
  category: string
): SmartVisualization | null => {
  try {
    const primaryNumeric = numericColumns[0];
    const values = data.map(row => parseFloat(row[primaryNumeric])).filter(val => !isNaN(val));
    
    if (values.length === 0) return null;

    // Create distribution buckets
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bucketCount = Math.min(10, Math.ceil(Math.sqrt(values.length)));
    const bucketSize = (max - min) / bucketCount;

    const buckets = Array.from({ length: bucketCount }, (_, i) => {
      const bucketMin = min + i * bucketSize;
      const bucketMax = min + (i + 1) * bucketSize;
      const count = values.filter(val => val >= bucketMin && (i === bucketCount - 1 ? val <= bucketMax : val < bucketMax)).length;
      
      return {
        name: `${bucketMin.toFixed(1)}-${bucketMax.toFixed(1)}`,
        value: count,
        percentage: (count / values.length * 100).toFixed(1)
      };
    });

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

    const insights = [
      `Mean value: ${mean.toFixed(2)}`,
      `Standard deviation: ${stdDev.toFixed(2)}`,
      `Data range: ${min.toFixed(2)} to ${max.toFixed(2)}`,
      `Distribution shows ${stdDev / mean > 0.5 ? 'high' : 'low'} variability`
    ];

    return {
      id: 'distribution',
      title: `Distribution of ${primaryNumeric}`,
      type: 'bar',
      data: buckets,
      category,
      insights,
      xAxisLabel: 'Value Range',
      yAxisLabel: 'Frequency',
      description: `Statistical distribution showing the frequency of different value ranges in ${primaryNumeric}`
    };
  } catch (error) {
    console.error('Error creating distribution visualization:', error);
    return null;
  }
};

const createCategoricalVisualization = (
  data: ParsedDataPoint[],
  categoricalColumns: string[],
  numericColumns: string[],
  category: string
): SmartVisualization | null => {
  try {
    const primaryCategorical = categoricalColumns[0];
    const primaryNumeric = numericColumns[0];

    let chartData;
    if (primaryNumeric) {
      // Aggregate numeric values by category
      const aggregated = data.reduce((acc, row) => {
        const cat = String(row[primaryCategorical] || 'Unknown');
        const val = parseFloat(row[primaryNumeric]) || 0;
        
        if (!acc[cat]) {
          acc[cat] = { sum: 0, count: 0 };
        }
        acc[cat].sum += val;
        acc[cat].count += 1;
        
        return acc;
      }, {} as any);

      chartData = Object.entries(aggregated)
        .map(([name, data]: [string, any]) => ({
          name,
          value: data.sum / data.count, // Average
          total: data.sum,
          count: data.count
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10 categories
    } else {
      // Just count frequencies
      const frequencies = data.reduce((acc, row) => {
        const cat = String(row[primaryCategorical] || 'Unknown');
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as any);

      chartData = Object.entries(frequencies)
        .map(([name, count]: [string, any]) => ({
          name,
          value: count,
          percentage: (count / data.length * 100).toFixed(1)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }

    const topCategory = chartData[0];
    const insights = [
      `${chartData.length} distinct categories found`,
      `Top category: ${topCategory.name} (${primaryNumeric ? topCategory.value.toFixed(2) : topCategory.value} ${primaryNumeric ? 'avg' : 'count'})`,
      `${chartData.length > 5 ? 'High' : 'Low'} category diversity`,
      primaryNumeric ? `Analysis based on average ${primaryNumeric} per category` : `Frequency distribution of ${primaryCategorical}`
    ];

    return {
      id: 'categorical',
      title: primaryNumeric ? `Average ${primaryNumeric} by ${primaryCategorical}` : `Distribution of ${primaryCategorical}`,
      type: chartData.length > 6 ? 'bar' : 'pie',
      data: chartData,
      category,
      insights,
      xAxisLabel: primaryCategorical,
      yAxisLabel: primaryNumeric || 'Count',
      description: `Analysis of ${primaryCategorical} ${primaryNumeric ? `with average ${primaryNumeric} values` : 'frequency distribution'}`
    };
  } catch (error) {
    console.error('Error creating categorical visualization:', error);
    return null;
  }
};

const createCorrelationVisualization = (
  data: ParsedDataPoint[],
  numericColumns: string[],
  category: string
): SmartVisualization | null => {
  try {
    if (numericColumns.length < 2) return null;

    const xColumn = numericColumns[0];
    const yColumn = numericColumns[1];

    const scatterData = data
      .map(row => ({
        x: parseFloat(row[xColumn]),
        y: parseFloat(row[yColumn]),
        name: `(${parseFloat(row[xColumn])?.toFixed(1)}, ${parseFloat(row[yColumn])?.toFixed(1)})`
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y))
      .slice(0, 100); // Limit points for performance

    if (scatterData.length < 3) return null;

    // Calculate correlation coefficient
    const correlation = calculateCorrelation(scatterData.map(d => d.x), scatterData.map(d => d.y));
    const correlationStrength = Math.abs(correlation) > 0.7 ? 'strong' : Math.abs(correlation) > 0.3 ? 'moderate' : 'weak';
    const correlationDirection = correlation > 0 ? 'positive' : 'negative';

    const insights = [
      `${correlationStrength} ${correlationDirection} correlation (${correlation.toFixed(3)})`,
      `${scatterData.length} data points analyzed`,
      correlation > 0.5 ? `${xColumn} and ${yColumn} tend to increase together` : 
      correlation < -0.5 ? `${xColumn} increases as ${yColumn} decreases` : 
      `No clear linear relationship between ${xColumn} and ${yColumn}`
    ];

    return {
      id: 'correlation',
      title: `${xColumn} vs ${yColumn} Correlation`,
      type: 'scatter',
      data: scatterData,
      category,
      insights,
      xAxisLabel: xColumn,
      yAxisLabel: yColumn,
      description: `Scatter plot analysis showing the relationship between ${xColumn} and ${yColumn}`
    };
  } catch (error) {
    console.error('Error creating correlation visualization:', error);
    return null;
  }
};

const createGeographicVisualization = (
  data: ParsedDataPoint[],
  parseResult: DataParseResult,
  category: string
): SmartVisualization | null => {
  try {
    const { columns, summary } = parseResult;
    
    // Look for geographic indicators
    const geoColumns = columns.filter(col => {
      const colLower = col.toLowerCase();
      return colLower.includes('lat') || colLower.includes('lng') || 
             colLower.includes('longitude') || colLower.includes('latitude') ||
             colLower.includes('country') || colLower.includes('region') ||
             colLower.includes('state') || colLower.includes('city');
    });

    if (geoColumns.length === 0) return null;

    // Simple geographic aggregation by country/region
    const geoColumn = geoColumns.find(col => 
      col.toLowerCase().includes('country') || 
      col.toLowerCase().includes('region') ||
      col.toLowerCase().includes('state')
    ) || geoColumns[0];

    const geoData = data.reduce((acc, row) => {
      const location = String(row[geoColumn] || 'Unknown');
      if (!acc[location]) {
        acc[location] = { count: 0, totalValue: 0 };
      }
      acc[location].count += 1;
      
      // Try to find a numeric value to aggregate
      const numericValue = parseResult.numericColumns.length > 0 ? 
        parseFloat(row[parseResult.numericColumns[0]]) || 0 : 1;
      acc[location].totalValue += numericValue;
      
      return acc;
    }, {} as any);

    const mapData = Object.entries(geoData)
      .map(([name, data]: [string, any]) => ({
        name,
        value: data.totalValue,
        count: data.count,
        lat: 0, // Would need geocoding service for real coordinates
        lng: 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    if (mapData.length === 0) return null;

    const insights = [
      `Geographic data covers ${mapData.length} locations`,
      `Top location: ${mapData[0].name} (${mapData[0].value} total value)`,
      `Data spans multiple geographic regions`,
      `Geographic analysis based on ${geoColumn}`
    ];

    return {
      id: 'geographic',
      title: `Geographic Distribution by ${geoColumn}`,
      type: 'map',
      data: mapData,
      category,
      insights,
      description: `Geographic visualization showing distribution of data across different ${geoColumn} values`
    };
  } catch (error) {
    console.error('Error creating geographic visualization:', error);
    return null;
  }
};

// Helper functions
const calculateTrend = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope * 100; // Return as percentage
};

const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};
