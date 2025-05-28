
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChartContent, 
  LineChartContent, 
  PieChartContent, 
  AreaChartContent 
} from '@/components/visualization/chart/ChartTypes';

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
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', 
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'
];

const InsightCard = ({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey = 'name',
  colors = COLORS,
  className,
  tooltipFormatter,
  xAxisLabel,
  yAxisLabel
}: InsightCardProps) => {
  // Ensure data is properly formatted
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      name: item[nameKey] || 'Unknown',
      value: typeof item[dataKey] === 'number' ? item[dataKey] : 0,
      ...item // Keep other properties
    }));
  }, [data, dataKey, nameKey]);
  
  if (processedData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const chartProps = {
      data: processedData,
      colors,
      tooltipFormatter,
      xAxisLabel,
      yAxisLabel
    };
    
    switch (type) {
      case 'bar':
        return <BarChartContent {...chartProps} />;
      case 'line':
        return <LineChartContent {...chartProps} />;
      case 'pie':
        return <PieChartContent {...chartProps} />;
      case 'area':
        return <AreaChartContent {...chartProps} />;
      default:
        return (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
