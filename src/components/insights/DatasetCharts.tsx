
import React from 'react';
import { Dataset } from '@/types/dataset';
import InsightCard from '../InsightCard';

interface DatasetChartsProps {
  dataset: Dataset;
  visualizationData: any[];
}

export const DatasetCharts: React.FC<DatasetChartsProps> = ({ dataset, visualizationData }) => {
  if (!visualizationData || visualizationData.length === 0) {
    return (
      <div className="glass border border-border/50 rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No visualization data available for this dataset.</p>
      </div>
    );
  }

  // Generate chart configurations based on dataset category and actual data
  const chartConfigs = getChartConfigsForCategory(dataset.category, visualizationData);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {chartConfigs.map((config, index) => (
        <InsightCard
          key={index}
          title={config.title}
          description={config.description}
          data={config.transformData ? config.transformData(visualizationData) : visualizationData}
          type={config.type}
          dataKey={config.dataKey}
          nameKey={config.nameKey}
          className={config.className}
        />
      ))}
    </div>
  );
};

interface ChartConfig {
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar';
  dataKey: string;
  nameKey?: string;
  className: string;
  transformData?: (data: any[]) => any[];
}

const getChartConfigsForCategory = (category: string, data: any[]): ChartConfig[] => {
  switch(category.toLowerCase()) {
    case 'economics':
      return [
        {
          title: "Economic Distribution",
          description: "Distribution of economic factors",
          type: "pie",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.map(item => ({
            ...item,
            name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name
          }))
        },
        {
          title: "Economic Comparison",
          description: "Comparative analysis of factors",
          type: "bar",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        }
      ];
      
    case 'health':
      return [
        {
          title: "Health Indicators",
          description: "Key health metrics analysis",
          type: "bar",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value).slice(0, 10)
        },
        {
          title: "Health Distribution",
          description: "Distribution of health metrics",
          type: "pie",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 5)
        }
      ];
      
    case 'education':
      return [
        {
          title: "Education Metrics",
          description: "Key education performance indicators",
          type: "bar",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2"
        },
        {
          title: "Education Distribution",
          description: "Distribution of education factors",
          type: "pie",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 6)
        }
      ];

    case 'transport':
      return [
        {
          title: "Transport Volume",
          description: "Volume by transport mode",
          type: "bar", 
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        },
        {
          title: "Modal Share",
          description: "Distribution of transport modes",
          type: "pie",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2"
        }
      ];
      
    case 'environment':
      return [
        {
          title: "Environmental Factors",
          description: "Key environmental indicators",
          type: "bar",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        },
        {
          title: "Environmental Distribution",
          description: "Distribution of factors",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => 
            a.name.localeCompare(b.name))
        }
      ];
      
    case 'demographics':
      return [
        {
          title: "Population Distribution",
          description: "Distribution by demographic groups",
          type: "pie",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2"
        },
        {
          title: "Demographic Comparison",
          description: "Comparison across groups",
          type: "bar",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        }
      ];
      
    default:
      // Default visualizations for other dataset types
      return [
        {
          title: "Data Distribution",
          description: "Distribution of values",
          type: "pie",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 8)
        },
        {
          title: "Comparative Analysis",
          description: "Comparative view of data points",
          type: "bar",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        }
      ];
  }
};
