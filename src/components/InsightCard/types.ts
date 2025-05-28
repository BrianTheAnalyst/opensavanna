
export interface InsightCardProps {
  title: string;
  description?: string;
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar';
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  className?: string;
  tooltipFormatter?: (value: any, name: any) => React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const DEFAULT_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', 
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'
];
