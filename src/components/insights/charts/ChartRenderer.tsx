
import React from 'react';

import InsightCard from '../../InsightCard';

import { ChartConfig } from './types';

interface ChartRendererProps {
  config: ChartConfig;
  data: any[];
  index: number;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, data, index }) => {
  // Process data based on configuration
  const processedData = config.transformData ? config.transformData(data) : data;
  
  return (
    <InsightCard
      key={index}
      title={config.title}
      description={config.description}
      data={processedData}
      type={config.type}
      dataKey={config.dataKey}
      nameKey={config.nameKey}
      className={config.className}
    />
  );
};

export default ChartRenderer;
