
import { Metric, MetricGenerationData } from './types';

export const generateEnvironmentMetrics = (data: MetricGenerationData): Metric[] => {
  const { highestItem, lowestItem, stdDevPercentage, dataPointCount } = data;
  
  return [
    {
      type: 'highlight',
      title: 'Environmental Factors',
      value: dataPointCount,
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
};
