
import { ChartConfig } from './types';

// Get chart configurations based on dataset category
export const getChartConfigsForCategory = (category: string, data: any[]): ChartConfig[] => {
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
