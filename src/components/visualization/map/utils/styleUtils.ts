
import { getColorForValue, getColorScaleForCategory } from './colorUtils';

/**
 * Style a GeoJSON feature based on its properties and visualization type
 * 
 * @param feature GeoJSON feature
 * @param visualizationType Visualization type (choropleth, standard, etc.)
 * @param category Data category
 * @returns Style object for the feature
 */
export const styleFeature = (feature: any, visualizationType: string = 'standard', category?: string) => {
  // Base style for all features
  const baseStyle = {
    weight: 1,
    opacity: 0.8,
    color: '#555',
    fillOpacity: 0.7,
    fillColor: '#6366f1' // Default indigo color
  };
  
  // For choropleth maps, color features based on their values
  if (visualizationType === 'choropleth' && feature && feature.properties) {
    // Get the value to use for coloring
    // Look for common value fields in properties
    const valueFields = ['value', 'data', 'electricity', 'consumption', 'population', 'count', 'amount'];
    let value: number | undefined;
    
    // Find the first numeric value
    for (const field of valueFields) {
      if (typeof feature.properties[field] === 'number') {
        value = feature.properties[field];
        break;
      }
    }
    
    // If no value found, use 0
    value = value !== undefined ? value : 0;
    
    // Get min and max values from the feature collection if available
    let min = 0;
    let max = 100;
    
    // If feature has a parent collection with metadata, use its min/max
    if (feature.parent && feature.parent.metadata && feature.parent.metadata.numericFields) {
      const valueField = Object.values(feature.parent.metadata.numericFields)[0] as any;
      if (valueField) {
        min = valueField.min || min;
        max = valueField.max || max;
      }
    }
    
    // Normalize value between 0 and 1
    const normalizedValue = (value - min) / (max - min);
    
    // Get color scale for category
    const colorScale = getColorScaleForCategory(category);
    
    // Get color for normalized value
    const color = getColorForValue(normalizedValue, colorScale);
    
    // Return style with calculated color
    return {
      ...baseStyle,
      fillColor: color
    };
  }
  
  // For other visualization types, use simpler styling
  return baseStyle;
};

// Calculate classification breaks using different methods
export const calculateBreaks = (
  values: number[],
  method: 'equal-interval' | 'quantile' | 'natural-breaks' = 'equal-interval',
  numClasses: number = 5
): number[] => {
  if (values.length === 0) return [];
  
  // Sort values for all methods
  const sortedValues = [...values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  
  switch (method) {
    case 'equal-interval':
      // Create breaks that are evenly spaced
      const interval = (max - min) / numClasses;
      return Array.from({ length: numClasses + 1 }, (_, i) => min + interval * i);
      
    case 'quantile':
      // Create breaks that have equal number of values in each class
      const breaksQuantile = [min];
      for (let i = 1; i < numClasses; i++) {
        const index = Math.floor((i / numClasses) * sortedValues.length);
        breaksQuantile.push(sortedValues[index]);
      }
      breaksQuantile.push(max);
      return breaksQuantile;
      
    case 'natural-breaks':
      // Simplified Jenks Natural Breaks implementation
      // For a full implementation, consider using a specialized library
      // For now, we'll use a mix of equal interval and quantile
      const breaksNatural = [min];
      for (let i = 1; i < numClasses; i++) {
        const quantileIndex = Math.floor((i / numClasses) * sortedValues.length);
        const equalInterval = min + (i / numClasses) * (max - min);
        // Mix the two approaches
        breaksNatural.push((sortedValues[quantileIndex] + equalInterval) / 2);
      }
      breaksNatural.push(max);
      return breaksNatural;
      
    default:
      return Array.from({ length: numClasses + 1 }, (_, i) => min + (max - min) * (i / numClasses));
  }
};

// Extract numeric values from features for calculations
export const extractNumericValues = (
  features: any[], 
  propertyName: string = 'value'
): number[] => {
  return features
    .map(feature => {
      if (!feature.properties) return null;
      // Try to find the first numeric property
      if (typeof feature.properties[propertyName] === 'number') {
        return feature.properties[propertyName];
      }
      // If not found, check other common value fields
      const valueFields = ['data', 'electricity', 'consumption', 'population', 'count', 'amount'];
      for (const field of valueFields) {
        if (typeof feature.properties[field] === 'number') {
          return feature.properties[field];
        }
      }
      return null;
    })
    .filter(value => value !== null) as number[];
};

// Re-export the function with a better name for clarity
export { styleFeature as getStyleForFeature }; // Also export with old name for backward compatibility
