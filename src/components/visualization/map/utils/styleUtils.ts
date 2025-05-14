
import { PathOptions } from 'leaflet';
import { getColorScaleForCategory } from './colorUtils';
import { findValueInProperties } from './dataUtils';

// Style function for GeoJSON
export const styleFeature = (feature: any, visualizationType: string = 'standard', category?: string): PathOptions => {
  // Default colors for standard maps
  const baseStyle: PathOptions = {
    weight: 1,
    opacity: 0.8,
    color: '#6366F1',
    fillOpacity: 0.5,
    fillColor: '#818CF8'
  };

  // If not using choropleth, return the standard style
  if (visualizationType !== 'choropleth') {
    return baseStyle;
  }
  
  // For choropleth maps, determine color based on value
  if (feature.properties) {
    const value = findValueInProperties(feature.properties);
    if (value !== null) {
      const colorScale = getColorScaleForCategory(category);
      const normalizedValue = getNormalizedValue(value, feature, colorScale.length);
      
      return {
        ...baseStyle,
        weight: 1,
        color: '#fff',
        opacity: 0.5,
        fillColor: colorScale[normalizedValue],
        fillOpacity: 0.8
      };
    }
  }
  
  return baseStyle;
};

// Get normalized value index for color scale
const getNormalizedValue = (value: number, feature: any, numColors: number): number => {
  // Try to find min/max values in the feature collection if available
  const collection = feature?.parent;
  
  if (collection && collection.features && collection.features.length > 0) {
    const values = collection.features
      .map((f: any) => findValueInProperties(f.properties))
      .filter((v: number | null) => v !== null) as number[];
    
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (min !== max) {
        const normalized = Math.floor(((value - min) / (max - min)) * (numColors - 1));
        return Math.max(0, Math.min(normalized, numColors - 1));
      }
    }
  }
  
  // Fallback to simple value-based bucketing
  // Scale value to a number between 0 and numColors-1
  if (value > 1000) return numColors - 1;
  if (value > 500) return Math.floor(numColors * 0.8);
  if (value > 100) return Math.floor(numColors * 0.6);
  if (value > 50) return Math.floor(numColors * 0.4);
  if (value > 10) return Math.floor(numColors * 0.2);
  return 0;
};
