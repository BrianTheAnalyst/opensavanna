
import { DataParseResult, ParsedDataPoint } from './dataParser';

export interface DataInsight {
  type: 'trend' | 'correlation' | 'anomaly' | 'distribution' | 'seasonal' | 'threshold';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  data?: any[];
  recommendations?: string[];
}

export interface IntelligentVisualization {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'scatter' | 'heatmap' | 'distribution' | 'correlation_matrix';
  data: any[];
  insights: DataInsight[];
  xAxis: string;
  yAxis: string;
  description: string;
  purpose: string;
}

export class IntelligentDataAnalyzer {
  private parseResult: DataParseResult;
  
  constructor(parseResult: DataParseResult) {
    this.parseResult = parseResult;
  }

  public analyzeData(): IntelligentVisualization[] {
    const visualizations: IntelligentVisualization[] = [];
    
    // 1. Time Series Analysis
    if (this.parseResult.dateColumns.length > 0 && this.parseResult.numericColumns.length > 0) {
      visualizations.push(...this.createTimeSeriesAnalysis());
    }
    
    // 2. Correlation Analysis
    if (this.parseResult.numericColumns.length >= 2) {
      visualizations.push(...this.createCorrelationAnalysis());
    }
    
    // 3. Distribution Analysis
    if (this.parseResult.numericColumns.length > 0) {
      visualizations.push(...this.createDistributionAnalysis());
    }
    
    // 4. Categorical Analysis
    if (this.parseResult.categoricalColumns.length > 0 && this.parseResult.numericColumns.length > 0) {
      visualizations.push(...this.createCategoricalAnalysis());
    }
    
    return visualizations.slice(0, 6); // Return top 6 most relevant
  }

  private createTimeSeriesAnalysis(): IntelligentVisualization[] {
    const dateCol = this.parseResult.dateColumns[0];
    const numericCols = this.parseResult.numericColumns.slice(0, 3); // Top 3 metrics
    const visualizations: IntelligentVisualization[] = [];

    numericCols.forEach((numCol) => {
      const timeSeriesData = this.parseResult.data
        .map(row => ({
          date: new Date(row[dateCol]),
          value: parseFloat(row[numCol]) || 0,
          period: this.formatDateForGrouping(new Date(row[dateCol]))
        }))
        .filter(item => !isNaN(item.date.getTime()))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (timeSeriesData.length < 3) return;

      // Aggregate by period for cleaner visualization
      const aggregatedData = this.aggregateByPeriod(timeSeriesData);
      
      // Analyze trends
      const insights = this.analyzeTrends(aggregatedData, numCol);
      
      visualizations.push({
        id: `timeseries-${numCol}`,
        title: `${numCol} Trends Over Time`,
        type: 'line',
        data: aggregatedData.map(item => ({
          name: item.period,
          value: item.avgValue,
          rawValue: item.totalValue,
          count: item.count
        })),
        insights,
        xAxis: 'Time Period',
        yAxis: numCol,
        description: `Temporal analysis showing how ${numCol} changes over time`,
        purpose: 'Identify trends, seasonality, and growth patterns'
      });
    });

    return visualizations;
  }

  private createCorrelationAnalysis(): IntelligentVisualization[] {
    const numericCols = this.parseResult.numericColumns;
    const correlations = this.calculateCorrelationMatrix(numericCols);
    const strongCorrelations = this.findStrongCorrelations(correlations);
    
    if (strongCorrelations.length === 0) return [];

    // Create scatter plot for strongest correlation
    const strongest = strongCorrelations[0];
    const scatterData = this.parseResult.data
      .map(row => ({
        x: parseFloat(row[strongest.col1]) || 0,
        y: parseFloat(row[strongest.col2]) || 0,
        name: `(${parseFloat(row[strongest.col1])?.toFixed(2)}, ${parseFloat(row[strongest.col2])?.toFixed(2)})`
      }))
      .filter(item => !isNaN(item.x) && !isNaN(item.y))
      .slice(0, 100); // Limit for performance

    const insights: DataInsight[] = [
      {
        type: 'correlation',
        title: `Strong ${strongest.correlation > 0 ? 'Positive' : 'Negative'} Correlation`,
        description: `${strongest.col1} and ${strongest.col2} show ${Math.abs(strongest.correlation) > 0.7 ? 'strong' : 'moderate'} correlation (${strongest.correlation.toFixed(3)})`,
        confidence: Math.abs(strongest.correlation),
        impact: Math.abs(strongest.correlation) > 0.7 ? 'high' : 'medium',
        recommendations: [
          `Monitor ${strongest.col1} as a leading indicator for ${strongest.col2}`,
          `Consider the relationship when making decisions affecting either metric`
        ]
      }
    ];

    return [{
      id: 'correlation-analysis',
      title: `${strongest.col1} vs ${strongest.col2} Relationship`,
      type: 'scatter',
      data: scatterData,
      insights,
      xAxis: strongest.col1,
      yAxis: strongest.col2,
      description: `Correlation analysis revealing the relationship between key variables`,
      purpose: 'Understand how different metrics influence each other'
    }];
  }

  private createDistributionAnalysis(): IntelligentVisualization[] {
    const primaryNumeric = this.parseResult.numericColumns[0];
    const values = this.parseResult.data
      .map(row => parseFloat(row[primaryNumeric]))
      .filter(val => !isNaN(val));
    
    if (values.length < 10) return [];

    const stats = this.calculateStatistics(values);
    const distribution = this.createDistributionBuckets(values);
    
    const insights: DataInsight[] = [
      {
        type: 'distribution',
        title: 'Data Distribution Pattern',
        description: `${primaryNumeric} shows ${this.getDistributionType(stats)} distribution`,
        confidence: 0.8,
        impact: 'medium',
        recommendations: [
          `Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median.toFixed(2)}`,
          `Standard deviation: ${stats.stdDev.toFixed(2)} (${((stats.stdDev / stats.mean) * 100).toFixed(1)}% coefficient of variation)`
        ]
      }
    ];

    if (stats.outliers.length > 0) {
      insights.push({
        type: 'anomaly',
        title: 'Outliers Detected',
        description: `${stats.outliers.length} outlier(s) found that deviate significantly from the norm`,
        confidence: 0.9,
        impact: 'high',
        recommendations: [`Investigate outlier values: ${stats.outliers.slice(0, 3).map(o => o.toFixed(2)).join(', ')}`]
      });
    }

    return [{
      id: 'distribution-analysis',
      title: `${primaryNumeric} Distribution Analysis`,
      type: 'bar',
      data: distribution,
      insights,
      xAxis: 'Value Range',
      yAxis: 'Frequency',
      description: `Statistical distribution showing the spread and frequency of ${primaryNumeric} values`,
      purpose: 'Identify patterns, outliers, and data quality issues'
    }];
  }

  private createCategoricalAnalysis(): IntelligentVisualization[] {
    const catCol = this.parseResult.categoricalColumns[0];
    const numCol = this.parseResult.numericColumns[0];
    
    const categoryStats = this.parseResult.data.reduce((acc, row) => {
      const category = String(row[catCol] || 'Unknown');
      const value = parseFloat(row[numCol]) || 0;
      
      if (!acc[category]) {
        acc[category] = { values: [], sum: 0, count: 0 };
      }
      acc[category].values.push(value);
      acc[category].sum += value;
      acc[category].count += 1;
      
      return acc;
    }, {} as any);

    const analysisData = Object.entries(categoryStats)
      .map(([category, stats]: [string, any]) => ({
        name: category,
        value: stats.sum / stats.count, // Average
        total: stats.sum,
        count: stats.count,
        variance: this.calculateVariance(stats.values)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const insights = this.analyzeCategoricalPatterns(analysisData, catCol, numCol);

    return [{
      id: 'categorical-analysis',
      title: `${numCol} Performance by ${catCol}`,
      type: 'bar',
      data: analysisData,
      insights,
      xAxis: catCol,
      yAxis: `Average ${numCol}`,
      description: `Comparative analysis showing how ${numCol} varies across different ${catCol} categories`,
      purpose: 'Identify high-performing categories and opportunities for improvement'
    }];
  }

  // Helper methods
  private formatDateForGrouping(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private aggregateByPeriod(data: any[]): any[] {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.period]) {
        acc[item.period] = { totalValue: 0, count: 0 };
      }
      acc[item.period].totalValue += item.value;
      acc[item.period].count += 1;
      return acc;
    }, {} as any);

    return Object.entries(grouped).map(([period, stats]: [string, any]) => ({
      period,
      avgValue: stats.totalValue / stats.count,
      totalValue: stats.totalValue,
      count: stats.count
    }));
  }

  private analyzeTrends(data: any[], metric: string): DataInsight[] {
    if (data.length < 3) return [];

    const values = data.map(d => d.avgValue);
    const trend = this.calculateTrendDirection(values);
    const volatility = this.calculateVolatility(values);
    
    const insights: DataInsight[] = [{
      type: 'trend',
      title: `${trend.direction} Trend Detected`,
      description: `${metric} shows ${trend.strength} ${trend.direction.toLowerCase()} trend with ${trend.slope.toFixed(2)}% average change`,
      confidence: trend.confidence,
      impact: trend.strength === 'Strong' ? 'high' : 'medium',
      recommendations: trend.direction === 'Upward' 
        ? [`Maintain current strategies driving ${metric} growth`]
        : [`Investigate factors causing ${metric} decline`]
    }];

    if (volatility > 0.3) {
      insights.push({
        type: 'anomaly',
        title: 'High Volatility',
        description: `${metric} shows high volatility (${(volatility * 100).toFixed(1)}% coefficient of variation)`,
        confidence: 0.8,
        impact: 'medium',
        recommendations: ['Consider implementing stabilization measures']
      });
    }

    return insights;
  }

  private calculateCorrelationMatrix(columns: string[]): any[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < columns.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const col1Values = this.parseResult.data.map(row => parseFloat(row[columns[i]])).filter(v => !isNaN(v));
          const col2Values = this.parseResult.data.map(row => parseFloat(row[columns[j]])).filter(v => !isNaN(v));
          matrix[i][j] = this.calculateCorrelation(col1Values, col2Values);
        }
      }
    }
    
    return matrix;
  }

  private findStrongCorrelations(matrix: number[][]): any[] {
    const correlations: any[] = [];
    const columns = this.parseResult.numericColumns;
    
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix[i].length; j++) {
        const correlation = matrix[i][j];
        if (Math.abs(correlation) > 0.3) { // Threshold for meaningful correlation
          correlations.push({
            col1: columns[i],
            col2: columns[j],
            correlation
          });
        }
      }
    }
    
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  private calculateStatistics(values: number[]): any {
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Detect outliers using IQR method
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const outliers = values.filter(val => val < q1 - 1.5 * iqr || val > q3 + 1.5 * iqr);
    
    return { mean, median, variance, stdDev, outliers, q1, q3, iqr };
  }

  private createDistributionBuckets(values: number[]): any[] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bucketCount = Math.min(10, Math.ceil(Math.sqrt(values.length)));
    const bucketSize = (max - min) / bucketCount;
    
    const buckets = Array.from({ length: bucketCount }, (_, i) => {
      const bucketMin = min + i * bucketSize;
      const bucketMax = min + (i + 1) * bucketSize;
      const count = values.filter(val => 
        val >= bucketMin && (i === bucketCount - 1 ? val <= bucketMax : val < bucketMax)
      ).length;
      
      return {
        name: `${bucketMin.toFixed(1)}-${bucketMax.toFixed(1)}`,
        value: count,
        percentage: ((count / values.length) * 100).toFixed(1)
      };
    });
    
    return buckets.filter(bucket => bucket.value > 0);
  }

  private getDistributionType(stats: any): string {
    const skewness = this.calculateSkewness(stats);
    if (Math.abs(skewness) < 0.5) return 'normal';
    if (skewness > 0.5) return 'right-skewed';
    return 'left-skewed';
  }

  private calculateSkewness(stats: any): number {
    // Simplified skewness calculation
    return (stats.mean - stats.median) / stats.stdDev;
  }

  private analyzeCategoricalPatterns(data: any[], catCol: string, numCol: string): DataInsight[] {
    const insights: DataInsight[] = [];
    
    if (data.length === 0) return insights;
    
    const topPerformer = data[0];
    const bottomPerformer = data[data.length - 1];
    const avgValue = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    
    insights.push({
      type: 'threshold',
      title: 'Performance Leaders',
      description: `${topPerformer.name} leads with ${topPerformer.value.toFixed(2)} average ${numCol}`,
      confidence: 0.9,
      impact: 'high',
      recommendations: [`Study ${topPerformer.name}'s practices for replication`]
    });
    
    if (topPerformer.value / bottomPerformer.value > 2) {
      insights.push({
        type: 'anomaly',
        title: 'Significant Performance Gap',
        description: `${(topPerformer.value / bottomPerformer.value).toFixed(1)}x difference between top and bottom performers`,
        confidence: 0.85,
        impact: 'high',
        recommendations: [`Focus improvement efforts on underperforming categories`]
      });
    }
    
    return insights;
  }

  private calculateTrendDirection(values: number[]): any {
    if (values.length < 2) return { direction: 'Stable', strength: 'None', slope: 0, confidence: 0 };
    
    // Simple linear regression for trend
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = values.reduce((sum, val) => sum + val, 0) / n;
    
    const slope = x.reduce((sum, xi, i) => sum + (xi - meanX) * (values[i] - meanY), 0) /
                  x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);
    
    const percentageSlope = (slope / meanY) * 100;
    const absSlope = Math.abs(percentageSlope);
    
    return {
      direction: slope > 0.1 ? 'Upward' : slope < -0.1 ? 'Downward' : 'Stable',
      strength: absSlope > 5 ? 'Strong' : absSlope > 1 ? 'Moderate' : 'Weak',
      slope: percentageSlope,
      confidence: Math.min(0.9, absSlope / 10)
    };
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denomX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
    const denomY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));
    
    return denomX === 0 || denomY === 0 ? 0 : numerator / (denomX * denomY);
  }
}
