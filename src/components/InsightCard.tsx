import React from 'react';
import EnhancedInsightCard from './visualization/echarts/EnhancedInsightCard';
import { ChartType } from './visualization/echarts/EChartsRenderer';

interface InsightCardProps {
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

const COLORS = [
  'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))',
  'hsl(var(--secondary))', 'hsl(var(--accent))'
];

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[120px]">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {formatter ? formatter(entry.value, entry.name) : 
                `${entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const InsightCard = ({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey = 'name',
  className,
  xAxisLabel,
  yAxisLabel
}: InsightCardProps) => {
  // Map old chart types to new ECharts types
  const chartType: ChartType = type as ChartType;

  return (
    <EnhancedInsightCard
      title={title}
      description={description}
      data={data}
      type={chartType}
      dataKey={dataKey}
      nameKey={nameKey}
      className={className}
      config={{
        xAxisLabel,
        yAxisLabel,
        showLegend: true,
        showGrid: true,
        smooth: type === 'line',
      }}
      enableCrossFilter={true}
    />
  );
};

export default InsightCard;
