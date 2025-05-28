
import { useMemo } from 'react';

export interface LayerConfig {
  id: string;
  name: string;
  category: string;
}

export const useMapLayers = (category: string): LayerConfig[] => {
  return useMemo(() => {
    const commonLayers = [
      { id: 'population', name: 'Population Density', category: 'Demographics' }
    ];
    
    if (category.toLowerCase().includes('climate') || category.toLowerCase().includes('environment')) {
      return [
        ...commonLayers,
        { id: 'temperature', name: 'Temperature', category: 'Climate' },
        { id: 'precipitation', name: 'Precipitation', category: 'Climate' },
        { id: 'wind', name: 'Wind Speed', category: 'Climate' },
        { id: 'humidity', name: 'Humidity', category: 'Climate' },
        { id: 'land_cover', name: 'Land Cover', category: 'Environment' },
        { id: 'co2', name: 'CO2 Emissions', category: 'Environment' }
      ];
    } else if (category.toLowerCase().includes('economic') || category.toLowerCase().includes('finance')) {
      return [
        ...commonLayers,
        { id: 'gdp', name: 'GDP', category: 'Economics' },
        { id: 'income', name: 'Income Level', category: 'Economics' },
        { id: 'poverty', name: 'Poverty Rate', category: 'Economics' },
        { id: 'unemployment', name: 'Unemployment', category: 'Economics' },
        { id: 'infrastructure', name: 'Infrastructure', category: 'Economics' }
      ];
    } else if (category.toLowerCase().includes('health')) {
      return [
        ...commonLayers,
        { id: 'healthcare_access', name: 'Healthcare Access', category: 'Health' },
        { id: 'disease', name: 'Disease Prevalence', category: 'Health' },
        { id: 'vaccination', name: 'Vaccination Rate', category: 'Health' },
        { id: 'mortality', name: 'Mortality Rate', category: 'Health' },
        { id: 'life_expectancy', name: 'Life Expectancy', category: 'Health' }
      ];
    } else {
      return [
        ...commonLayers,
        { id: 'temperature', name: 'Temperature', category: 'Climate' },
        { id: 'income', name: 'Income Level', category: 'Economics' },
        { id: 'healthcare_access', name: 'Healthcare Access', category: 'Health' },
        { id: 'education', name: 'Education Level', category: 'Education' }
      ];
    }
  }, [category]);
};
