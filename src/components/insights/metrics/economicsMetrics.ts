
import { Metric, MetricGenerationData } from './types';

export const generateEconomicsMetrics = (data: MetricGenerationData): Metric[] => {
  const { totalValue, highestItem, lowestItem, avgValue, stdDevPercentage } = data;
  
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
};
