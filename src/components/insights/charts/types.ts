
// Type definitions for chart configurations
export interface ChartConfig {
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar';
  dataKey: string;
  nameKey?: string;
  className: string;
  transformData?: (data: any[]) => any[];
}
