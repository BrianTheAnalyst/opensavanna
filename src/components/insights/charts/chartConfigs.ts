
import { ChartConfig } from './types';

// Get chart configurations based on dataset category
export const getChartConfigsForCategory = (category: string, data: any[]): ChartConfig[] => {
  switch(category.toLowerCase()) {
    case 'economics':
      return [
        {
          title: "Economic Trends",
          description: "Time series analysis of economic indicators",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 15)
        },
        {
          title: "Economic Distribution",
          description: "Stacked area chart of economic factors",
          type: "area",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.map(item => ({
            ...item,
            name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name
          }))
        }
      ];
      
    case 'health':
      return [
        {
          title: "Health Metrics Over Time",
          description: "Line plot showing health indicator trends",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value).slice(0, 12)
        },
        {
          title: "Health Distribution",
          description: "Stacked area visualization of health metrics",
          type: "area",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 8)
        }
      ];
      
    case 'education':
      return [
        {
          title: "Education Progress",
          description: "Line chart showing education trends",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2"
        },
        {
          title: "Education Levels",
          description: "Area chart of education distribution",
          type: "area",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 6)
        }
      ];

    case 'transport':
      return [
        {
          title: "Transport Flow Analysis",
          description: "Line plot of transport volume trends",
          type: "line", 
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        },
        {
          title: "Transport Mode Distribution",
          description: "Stacked area showing modal share",
          type: "area",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2"
        }
      ];
      
    case 'environment':
      return [
        {
          title: "Environmental Trends",
          description: "Line chart of environmental indicators over time",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        },
        {
          title: "Environmental Impact",
          description: "Area chart showing cumulative environmental data",
          type: "area",
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
          title: "Population Trends",
          description: "Line plot of demographic changes over time",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2"
        },
        {
          title: "Demographic Composition",
          description: "Stacked area chart of population groups",
          type: "area",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value)
        }
      ];
      
    default:
      // Default visualizations with new chart types
      return [
        {
          title: "Data Trends",
          description: "Line plot showing data patterns over time",
          type: "line",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => data.slice(0, 10)
        },
        {
          title: "Data Distribution",
          description: "Area chart of value distribution",
          type: "area",
          dataKey: "value",
          nameKey: "name",
          className: "col-span-1 md:col-span-2",
          transformData: (data) => [...data].sort((a, b) => b.value - a.value).slice(0, 8)
        }
      ];
  }
};
