
import { Insight } from '../types';

// Generate sample geographic data for demonstration
export const generateSampleGeoData = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic') || categoryLower.includes('africa')) {
    return [
      { name: 'Lagos', lat: 6.5244, lng: 3.3792, value: 85, category: 'Major City' },
      { name: 'Cairo', lat: 30.0444, lng: 31.2357, value: 72, category: 'Capital' },
      { name: 'Cape Town', lat: -33.9249, lng: 18.4241, value: 93, category: 'Port City' },
      { name: 'Nairobi', lat: -1.2921, lng: 36.8219, value: 68, category: 'Regional Hub' }
    ];
  }
  
  return [
    { name: 'Location A', lat: 40.7128, lng: -74.0060, value: 75, category: 'Urban' },
    { name: 'Location B', lat: 34.0522, lng: -118.2437, value: 82, category: 'Metropolitan' },
    { name: 'Location C', lat: 51.5074, lng: -0.1278, value: 91, category: 'Capital' },
    { name: 'Location D', lat: 35.6762, lng: 139.6503, value: 67, category: 'Coastal' }
  ];
};

// Sample insights for insight panel
export const sampleInsights: Insight[] = [
  {
    id: '1',
    title: 'Geographic pattern detected',
    description: 'Regional clustering observed in the data distribution across major urban centers.',
    type: 'anomaly',
    confidence: 0.89,
    applied: false
  },
  {
    id: '2',
    title: 'Spatial correlation found',
    description: 'Strong geographic correlation between economic indicators and population density.',
    type: 'correlation',
    confidence: 0.76,
    applied: false
  }
];

// Define sample regions for spatial filtering
export const sampleRegions = [
  { id: 'north', name: 'Northern Region' },
  { id: 'south', name: 'Southern Region' },
  { id: 'east', name: 'Eastern Region' },
  { id: 'west', name: 'Western Region' },
  { id: 'central', name: 'Central Area' }
];

// Define available layers for selection
export const availableLayers = [
  { id: 'temperature', name: 'Temperature', category: 'Climate' },
  { id: 'precipitation', name: 'Precipitation', category: 'Climate' },
  { id: 'wind', name: 'Wind Speed', category: 'Climate' },
  { id: 'humidity', name: 'Humidity', category: 'Climate' },
  { id: 'population', name: 'Population Density', category: 'Demographics' },
  { id: 'income', name: 'Per Capita Income', category: 'Economics' },
  { id: 'land_cover', name: 'Land Cover', category: 'Environment' },
  { id: 'co2', name: 'CO2 Emissions', category: 'Environment' }
];
