
import { getColorScaleForCategory, getColorForValue } from './colorUtils';

/**
 * Style function for GeoJSON features
 */
export const styleFeature = (
  feature: any, 
  visualizationType: 'standard' | 'choropleth' | 'heatmap', 
  category?: string,
  anomalyDetection?: boolean
): object => {
  if (!feature || !feature.properties) {
    return { 
      color: '#6366F1',
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.5,
      fillColor: '#818CF8'
    };
  }

  const value = feature.properties.value;
  const isAnomaly = anomalyDetection && feature.properties.isAnomaly;
  
  // Base style object
  const style: any = {
    weight: isAnomaly ? 2 : 1,
    opacity: isAnomaly ? 1.0 : 0.7,
    color: isAnomaly ? '#B91C1C' : '#6366F1',
    dashArray: isAnomaly ? '3' : '',
    fillOpacity: isAnomaly ? 0.8 : 0.5
  };

  // Apply different styles based on visualization type
  if (visualizationType === 'choropleth' && typeof value === 'number') {
    const colorScale = getColorScaleForCategory(category || 'default');
    style.fillColor = getColorForValue(value, colorScale);
    
    // If it's an anomaly, adjust the fillColor to be more intense
    if (isAnomaly) {
      // Make the color more saturated/bright for anomalies
      style.fillColor = makeColorMoreIntense(style.fillColor);
    }
  } else {
    // For standard visualization
    style.fillColor = isAnomaly ? '#FB7185' : '#818CF8';
  }

  return style;
};

/**
 * Makes a hex color more intense (brighter/more saturated)
 * @param hexColor - Original hex color
 * @returns Modified hex color
 */
function makeColorMoreIntense(hexColor: string): string {
  // Simple implementation - just return a more intense color
  // In a real implementation, you'd convert to HSL, increase saturation/luminosity, and convert back
  return hexColor === '#818CF8' ? '#4F46E5' : hexColor;
}

/**
 * Get style properties for a feature
 */
export const getStyleForFeature = (feature: any, isHighlighted: boolean = false): object => {
  return {
    color: isHighlighted ? '#4338CA' : '#6366F1',
    weight: isHighlighted ? 3 : 1,
    opacity: isHighlighted ? 1.0 : 0.7,
    fillOpacity: isHighlighted ? 0.7 : 0.4,
    fillColor: isHighlighted ? '#4F46E5' : '#818CF8'
  };
};
