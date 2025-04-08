
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

export interface MetricGenerationData {
  totalValue: number;
  highestItem: { name: string; value: number };
  lowestItem: { name: string; value: number };
  avgValue: number;
  stdDevPercentage: number;
  dataPointCount: number;
}
