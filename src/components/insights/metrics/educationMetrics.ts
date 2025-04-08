
import { Metric, MetricGenerationData } from './types';

export const generateEducationMetrics = (data: MetricGenerationData): Metric[] => {
  const { totalValue, highestItem, lowestItem, stdDevPercentage } = data;
  
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
};
