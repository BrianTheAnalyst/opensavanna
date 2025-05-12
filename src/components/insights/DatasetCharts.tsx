
import React from 'react';
import { Dataset } from '@/types/dataset';
import EmptyChartState from './charts/EmptyChartState';
import ChartRenderer from './charts/ChartRenderer';
import { getChartConfigsForCategory } from './charts/chartConfigs';

interface DatasetChartsProps {
  dataset: Dataset;
  visualizationData: any[];
}

export const DatasetCharts: React.FC<DatasetChartsProps> = ({ dataset, visualizationData }) => {
  // Check if we have valid data to display
  if (!visualizationData || visualizationData.length === 0) {
    return <EmptyChartState />;
  }

  // Generate chart configurations based on dataset category and actual data
  const chartConfigs = getChartConfigsForCategory(dataset.category, visualizationData);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {chartConfigs.map((config, index) => (
        <ChartRenderer
          key={index}
          config={config}
          data={visualizationData}
          index={index}
        />
      ))}
    </div>
  );
};
