
import { Dataset } from '@/types/dataset';
import { Metric, MetricGenerationData } from './types';
import { generateBaseMetrics } from './baseMetrics';
import { generateEconomicsMetrics } from './economicsMetrics';
import { generateHealthMetrics } from './healthMetrics';
import { generateEducationMetrics } from './educationMetrics';
import { generateTransportMetrics } from './transportMetrics';
import { generateEnvironmentMetrics } from './environmentMetrics';

// Main function to generate dataset metrics
export const generateDatasetMetrics = (dataset: Dataset, visualizationData: any[]): Metric[] => {
  // Check for empty data
  if (!Array.isArray(visualizationData) || visualizationData.length === 0) {
    return [
      {
        type: 'warning',
        title: 'No Data',
        description: 'No visualization data available for this dataset',
        color: 'warning'
      }
    ];
  }

  // Calculate common metrics
  const totalValue = visualizationData.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const sortedData = [...visualizationData].sort((a, b) => (b.value || 0) - (a.value || 0));
  const highestItem = sortedData[0];
  const lowestItem = sortedData[sortedData.length - 1];
  const avgValue = totalValue / visualizationData.length;
  
  // Calculate variance & standard deviation for data quality assessment
  const variance = visualizationData.reduce((sum, item) => 
    sum + Math.pow((Number(item.value || 0) - avgValue), 2), 0) / visualizationData.length;
  const stdDev = Math.sqrt(variance);
  const stdDevPercentage = (stdDev / avgValue) * 100;
  
  // Prepare common data for metric generators
  const metricData: MetricGenerationData = {
    totalValue,
    highestItem,
    lowestItem,
    avgValue,
    stdDevPercentage,
    dataPointCount: visualizationData.length
  };

  // Generate category-specific metrics
  switch(dataset.category.toLowerCase()) {
    case 'economics':
      return generateEconomicsMetrics(metricData);
    case 'health':
      return generateHealthMetrics(metricData);
    case 'education':
      return generateEducationMetrics(metricData);
    case 'transport':
      return generateTransportMetrics(metricData);
    case 'environment':
      return generateEnvironmentMetrics(metricData);
    default:
      // Default metrics for other dataset types
      return generateBaseMetrics(metricData);
  }
};

export { Metric } from './types';
export type { MetricType, MetricColor } from './types';

