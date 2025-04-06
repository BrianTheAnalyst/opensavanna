
import { Dataset } from '@/types/dataset';

export type MetricType = 'increase' | 'decrease' | 'trend' | 'warning' | 'highlight' | 'comparison';
export type MetricColor = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface Metric {
  type: MetricType;
  title: string;
  value?: string | number;
  description: string;
  percentage?: number;
  color?: MetricColor;
}

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
  
  // Generate category-specific metrics
  switch(dataset.category.toLowerCase()) {
    case 'economics':
      return [
        {
          type: 'highlight',
          title: 'Total',
          value: totalValue.toLocaleString(undefined, {maximumFractionDigits: 2}),
          description: 'Total economic value across all categories',
          color: 'info'
        },
        {
          type: 'increase',
          title: 'Highest Value',
          value: highestItem.name,
          description: `${highestItem.value.toLocaleString(undefined, {maximumFractionDigits: 2})} (${Math.round(highestItem.value/totalValue*100)}%)`,
          percentage: Math.round(highestItem.value/totalValue*100),
          color: 'success'
        },
        {
          type: 'decrease',
          title: 'Lowest Value',
          value: lowestItem.name,
          description: `${lowestItem.value.toLocaleString(undefined, {maximumFractionDigits: 2})} (${Math.round(lowestItem.value/totalValue*100)}%)`,
          percentage: Math.round(lowestItem.value/totalValue*100),
          color: 'warning'
        },
        {
          type: 'trend',
          title: 'Distribution',
          value: `${stdDevPercentage.toFixed(1)}%`,
          description: `Variation coefficient across categories`,
          color: stdDevPercentage > 50 ? 'warning' : 'default'
        }
      ];
      
    case 'health':
      return [
        {
          type: 'highlight',
          title: 'Total Cases',
          value: totalValue.toLocaleString(),
          description: 'Total health cases recorded',
          color: 'info'
        },
        {
          type: 'warning',
          title: 'Critical Area',
          value: highestItem.name,
          description: `${highestItem.value.toLocaleString()} cases (${Math.round(highestItem.value/totalValue*100)}%)`,
          percentage: Math.round(highestItem.value/totalValue*100),
          color: 'danger'
        },
        {
          type: 'decrease',
          title: 'Lowest Concern',
          value: lowestItem.name,
          description: `${lowestItem.value.toLocaleString()} cases (${Math.round(lowestItem.value/totalValue*100)}%)`,
          percentage: Math.round(lowestItem.value/totalValue*100),
          color: 'success'
        },
        {
          type: 'trend',
          title: 'Average',
          value: Math.round(avgValue).toLocaleString(),
          description: 'Average cases per category',
          color: 'default'
        }
      ];
      
    case 'education':
      return [
        {
          type: 'highlight',
          title: 'Total Students',
          value: totalValue.toLocaleString(),
          description: 'Total students across all educational levels',
          color: 'info'
        },
        {
          type: 'increase',
          title: 'Highest Enrollment',
          value: highestItem.name,
          description: `${highestItem.value.toLocaleString()} students (${Math.round(highestItem.value/totalValue*100)}%)`,
          percentage: Math.round(highestItem.value/totalValue*100),
          color: 'success'
        },
        {
          type: 'decrease',
          title: 'Lowest Enrollment',
          value: lowestItem.name,
          description: `${lowestItem.value.toLocaleString()} students (${Math.round(lowestItem.value/totalValue*100)}%)`,
          percentage: Math.round(lowestItem.value/totalValue*100),
          color: 'warning'
        },
        {
          type: 'comparison',
          title: 'Distribution',
          value: `${stdDevPercentage.toFixed(1)}%`,
          description: 'Variation in enrollment across categories',
          color: stdDevPercentage > 50 ? 'warning' : 'default'
        }
      ];
      
    case 'transport':
      return [
        {
          type: 'highlight',
          title: 'Transport Volume',
          value: totalValue.toLocaleString(),
          description: 'Total transport usage across modes',
          color: 'info'
        },
        {
          type: 'increase',
          title: 'Primary Mode',
          value: highestItem.name,
          description: `${highestItem.value.toLocaleString()} units (${Math.round(highestItem.value/totalValue*100)}%)`,
          percentage: Math.round(highestItem.value/totalValue*100),
          color: 'success'
        },
        {
          type: 'decrease',
          title: 'Least Used',
          value: lowestItem.name,
          description: `${lowestItem.value.toLocaleString()} units (${Math.round(lowestItem.value/totalValue*100)}%)`,
          percentage: Math.round(lowestItem.value/totalValue*100),
          color: 'warning'
        },
        {
          type: 'trend',
          title: 'Modal Split',
          value: `${(stdDevPercentage).toFixed(1)}%`,
          description: 'Variation across transport modes',
          color: 'default'
        }
      ];
      
    case 'environment':
      return [
        {
          type: 'highlight',
          title: 'Environmental Factors',
          value: visualizationData.length,
          description: 'Number of environmental factors analyzed',
          color: 'info'
        },
        {
          type: 'warning',
          title: 'Critical Factor',
          value: highestItem.name,
          description: `Value: ${highestItem.value.toLocaleString()}`,
          color: 'danger'
        },
        {
          type: 'decrease',
          title: 'Minor Factor',
          value: lowestItem.name,
          description: `Value: ${lowestItem.value.toLocaleString()}`,
          color: 'success'
        },
        {
          type: 'trend',
          title: 'Factor Variance',
          value: `${stdDevPercentage.toFixed(1)}%`,
          description: 'Variation in environmental factors',
          color: stdDevPercentage > 75 ? 'warning' : 'default'
        }
      ];
      
    default:
      // Default metrics for other dataset types
      return [
        {
          type: 'highlight',
          title: 'Data Points',
          value: visualizationData.length,
          description: 'Number of data points analyzed',
          color: 'info'
        },
        {
          type: 'increase',
          title: 'Maximum',
          value: highestItem.name,
          description: `Value: ${highestItem.value.toLocaleString()}`,
          color: 'success'
        },
        {
          type: 'decrease',
          title: 'Minimum',
          value: lowestItem.name,
          description: `Value: ${lowestItem.value.toLocaleString()}`,
          color: 'warning'
        },
        {
          type: 'trend',
          title: 'Average',
          value: avgValue.toLocaleString(undefined, {maximumFractionDigits: 2}),
          description: 'Average value across all data points',
          color: 'default'
        }
      ];
  }
};
