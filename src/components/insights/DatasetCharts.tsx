
import React from 'react';
import { Dataset } from '@/types/dataset';
import EmptyChartState from './charts/EmptyChartState';
import ChartRenderer from './charts/ChartRenderer';
import { getChartConfigsForCategory } from './charts/chartConfigs';

interface DatasetChartsProps {
  dataset: Dataset;
  visualizationData: any[];
}

// REMOVED: All sample data generation - strict validation only

export const DatasetCharts: React.FC<DatasetChartsProps> = ({ dataset, visualizationData }) => {
  // STRICT: Only use real data - no sample data fallback
  if (!visualizationData || visualizationData.length === 0) {
    console.warn('No visualization data provided');
    return (
      <EmptyChartState message="No visualization data available for this dataset. Please ensure the dataset contains valid data for visualization." />
    );
  }
  
  if (!Array.isArray(visualizationData)) {
    console.warn('Invalid visualization data format');
    return (
      <EmptyChartState message="Dataset format is invalid. Expected array of data records." />
    );
  }
  
  // Validate the provided data
  const validData = visualizationData.filter(item => 
    item && 
    typeof item === 'object' && 
    (item.name || item.category || item.label) &&
    (typeof item.value === 'number' || !isNaN(Number(item.value)))
  );
  
  if (validData.length === 0) {
    console.warn('Visualization data missing required fields');
    return (
      <EmptyChartState message="Dataset structure is invalid. Required fields: 'name' and 'value'." />
    );
  }
  
  const dataToUse = validData;

  // Generate chart configurations based on dataset category and actual data
  const chartConfigs = getChartConfigsForCategory(dataset.category, dataToUse);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {chartConfigs.map((config, index) => (
        <ChartRenderer
          key={index}
          config={config}
          data={dataToUse}
          index={index}
        />
      ))}
    </div>
  );
};
