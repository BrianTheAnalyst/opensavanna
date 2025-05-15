
// Re-export the function with a better name for clarity
export const styleFeature = (feature: any, visualizationType: string = 'standard', category?: string) => {
  const baseStyle = {
    weight: 1,
    opacity: 0.8,
    color: '#555',
    fillOpacity: 0.6,
    fillColor: '#6366f1' // Default indigo color
  };
  
  if (visualizationType === 'choropleth' && feature && feature.properties) {
    // Find a numeric value for choropleth coloring
    const value = feature.properties.value || 
                feature.properties.data || 
                feature.properties.electricity ||
                feature.properties.consumption ||
                0;
    
    // Get color based on value
    // We could implement a more sophisticated color scale based on min/max values
    const intensity = Math.min(Math.max((value / 100) * 255, 0), 255);
    
    if (category?.toLowerCase().includes('health')) {
      return {
        ...baseStyle,
        fillColor: `rgb(${255-intensity}, ${intensity}, 100)`
      };
    } else if (category?.toLowerCase().includes('education')) {
      return {
        ...baseStyle,
        fillColor: `rgb(100, ${intensity}, ${255-intensity})`
      };
    } else {
      return {
        ...baseStyle,
        fillColor: `rgb(${255-intensity}, ${Math.round(intensity*0.7)}, ${intensity})`
      };
    }
  }
  
  return baseStyle;
};

export { styleFeature as getStyleForFeature }; // Also export with old name for backward compatibility
