
import React from 'react';
import { 
  BarChartContent, 
  LineChartContent, 
  PieChartContent, 
  AreaChartContent 
} from '@/components/visualization/chart/ChartTypes';

interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar';
  data: any[];
  colors: string[];
  tooltipFormatter?: (value: any, name: any) => React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  type,
  data,
  colors,
  tooltipFormatter,
  xAxisLabel,
  yAxisLabel
}) => {
  const chartProps = {
    data,
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

export default ChartRenderer;
