
import { Metric, MetricGenerationData } from './types';

export const generateHealthMetrics = (data: MetricGenerationData): Metric[] => {
  const { totalValue, highestItem, lowestItem, avgValue } = data;
  
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
};
