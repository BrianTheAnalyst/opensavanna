
import { Metric, MetricGenerationData } from './types';

export const generateTransportMetrics = (data: MetricGenerationData): Metric[] => {
  const { totalValue, highestItem, lowestItem, stdDevPercentage } = data;
  
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
};
