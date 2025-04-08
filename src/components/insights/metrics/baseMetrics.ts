
import { Metric, MetricGenerationData } from './types';

// Generate default metrics that work for any dataset type
export const generateBaseMetrics = (data: MetricGenerationData): Metric[] => {
  const { totalValue, highestItem, lowestItem, avgValue, stdDevPercentage, dataPointCount } = data;
  
  return [
    {
      type: 'highlight',
      title: 'Data Points',
      value: dataPointCount,
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
};
