
import React from 'react';
import { Dataset } from '@/types/dataset';
import EmptyChartState from './charts/EmptyChartState';
import ChartRenderer from './charts/ChartRenderer';
import { getChartConfigsForCategory } from './charts/chartConfigs';

interface DatasetChartsProps {
  dataset: Dataset;
  visualizationData: any[];
}

// Generate meaningful sample data based on dataset category
const generateCategorySampleData = (category: string): any[] => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic')) {
    return [
      { name: 'GDP Growth', value: 3.2 },
      { name: 'Inflation Rate', value: 2.1 },
      { name: 'Unemployment', value: 4.8 },
      { name: 'Export Growth', value: 5.7 }
    ];
  }
  
  if (categoryLower.includes('health')) {
    return [
      { name: 'Life Expectancy', value: 78.5 },
      { name: 'Infant Mortality', value: 5.2 },
      { name: 'Healthcare Access', value: 92.3 },
      { name: 'Disease Prevention', value: 87.1 }
    ];
  }
  
  if (categoryLower.includes('education')) {
    return [
      { name: 'Literacy Rate', value: 96.2 },
      { name: 'Primary Enrollment', value: 98.7 },
      { name: 'Secondary Enrollment', value: 89.3 },
      { name: 'Higher Education', value: 67.8 }
    ];
  }
  
  if (categoryLower.includes('transport')) {
    return [
      { name: 'Road Quality', value: 7.2 },
      { name: 'Public Transport', value: 6.8 },
      { name: 'Traffic Safety', value: 8.1 },
      { name: 'Accessibility', value: 7.5 }
    ];
  }
  
  if (categoryLower.includes('environment')) {
    return [
      { name: 'Air Quality Index', value: 65 },
      { name: 'Water Quality', value: 82 },
      { name: 'Forest Coverage', value: 34 },
      { name: 'Renewable Energy', value: 28 }
    ];
  }
  
  // Default sample data
  return [
    { name: 'Metric A', value: 85 },
    { name: 'Metric B', value: 72 },
    { name: 'Metric C', value: 93 },
    { name: 'Metric D', value: 68 }
  ];
};

export const DatasetCharts: React.FC<DatasetChartsProps> = ({ dataset, visualizationData }) => {
  // Determine what data to use
  let dataToUse = visualizationData;
  
  if (!visualizationData || visualizationData.length === 0) {
    console.log(`No visualization data for dataset ${dataset.title}, generating sample data for category: ${dataset.category}`);
    dataToUse = generateCategorySampleData(dataset.category);
  } else {
    // Validate the provided data
    const validData = visualizationData.filter(item => 
      item && 
      typeof item === 'object' && 
      (item.name || item.category || item.label) &&
      (typeof item.value === 'number' || !isNaN(Number(item.value)))
    );
    
    if (validData.length === 0) {
      console.log(`Invalid data structure for dataset ${dataset.title}, using sample data`);
      dataToUse = generateCategorySampleData(dataset.category);
    } else {
      dataToUse = validData;
    }
  }

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
