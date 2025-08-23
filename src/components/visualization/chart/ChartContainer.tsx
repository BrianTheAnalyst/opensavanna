
import React from 'react';

import { BarChartContent, LineChartContent, PieChartContent } from './ChartTypes';

interface ChartContainerProps {
  data: any[];
  colors: string[];
  activeTab: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  data, 
  colors, 
  activeTab 
}) => {
  // Render the appropriate chart based on activeTab
  switch (activeTab) {
    case 'bar':
      return <BarChartContent data={data} colors={colors} />;
    case 'line':
      return <LineChartContent data={data} colors={colors} />;
    case 'pie':
      return <PieChartContent data={data} colors={colors} />;
    default:
      return <BarChartContent data={data} colors={colors} />;
  }
};

export default ChartContainer;
