
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
  if (dataset.title.toLowerCase().includes('transaction') || dataset.category.toLowerCase() === 'economics') {
    const totalSpending = visualizationData.reduce((sum, item) => sum + item.value, 0);
    const highestCategory = [...visualizationData].sort((a, b) => b.value - a.value)[0];
    const lowestCategory = [...visualizationData].sort((a, b) => a.value - b.value)[0];
    const avgSpending = totalSpending / visualizationData.length;
    
    return [
      {
        type: 'highlight',
        title: 'Total',
        value: totalSpending.toLocaleString(),
        description: 'Total across all categories',
        color: 'info'
      },
      {
        type: 'increase',
        title: 'Highest',
        value: highestCategory.name,
        description: `${highestCategory.value.toLocaleString()} (${Math.round(highestCategory.value/totalSpending*100)}%)`,
        percentage: Math.round(highestCategory.value/totalSpending*100),
        color: 'success'
      },
      {
        type: 'decrease',
        title: 'Lowest',
        value: lowestCategory.name,
        description: `${lowestCategory.value.toLocaleString()} (${Math.round(lowestCategory.value/totalSpending*100)}%)`,
        percentage: Math.round(lowestCategory.value/totalSpending*100),
        color: 'warning'
      },
      {
        type: 'trend',
        title: 'Average',
        value: Math.round(avgSpending).toLocaleString(),
        description: 'Average per category',
        color: 'default'
      }
    ];
  }
  
  // Default metrics for other dataset types
  return [
    {
      type: 'highlight',
      title: 'Key Points',
      value: visualizationData.length,
      description: 'Number of data points analyzed',
      color: 'info'
    },
    {
      type: 'trend',
      title: 'Insights',
      value: visualizationData.length > 0 ? visualizationData.length : 0,
      description: 'Automated insights detected',
      color: 'success'
    }
  ];
};
