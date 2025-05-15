
// Color palettes for different visualization types
export const colorRanges = {
  // Sequential color palette for choropleth maps
  sequential: [
    '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6',
    '#4292c6', '#2171b5', '#08519c', '#08306b'
  ],
  
  // Divergent color palette (for data that goes from negative to positive)
  divergent: [
    '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf',
    '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'
  ],
  
  // Categorical color palette for discrete categories
  categorical: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ],
  
  // Enhanced professional palettes for choropleth maps by category
  energy: [
    '#ffffd4', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#8c2d04'
  ],
  electricity: [
    '#edf8fb', '#b3cde3', '#8c96c6', '#8856a7', '#810f7c'
  ],
  health: [
    '#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'
  ],
  economics: [
    '#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#636363', '#252525'
  ],
  environment: [
    '#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'
  ],
  population: [
    '#f7fbff', '#d8e7f5', '#b9d7ea', '#9ac7da', '#6aaed6', '#4292c6', '#08589e'
  ],
  education: [
    '#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#dd1c77', '#980043'
  ],
  transport: [
    '#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'
  ],
  
  // For heatmaps
  heatmap: [
    'rgba(0, 0, 255, 0.4)', 'rgba(0, 255, 255, 0.5)', 
    'rgba(0, 255, 0, 0.6)', 'rgba(255, 255, 0, 0.7)', 
    'rgba(255, 0, 0, 0.8)'
  ]
};

/**
 * Returns a color from a palette based on a normalized value (0-1)
 * 
 * @param value Normalized value between 0 and 1
 * @param colorPalette Array of colors to interpolate between
 * @returns A color string
 */
export const getColorForValue = (value: number, colorPalette = colorRanges.sequential): string => {
  if (value <= 0) return colorPalette[0];
  if (value >= 1) return colorPalette[colorPalette.length - 1];
  
  // Map value to index in color palette
  const index = value * (colorPalette.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  
  // If value maps directly to a color, return it
  if (lowerIndex === upperIndex) return colorPalette[lowerIndex];
  
  // Otherwise interpolate between the two closest colors
  const ratio = index - lowerIndex;
  return interpolateColor(colorPalette[lowerIndex], colorPalette[upperIndex], ratio);
};

/**
 * Interpolate between two colors
 * 
 * @param color1 First color (CSS color string)
 * @param color2 Second color (CSS color string)
 * @param ratio Ratio between the two colors (0-1)
 * @returns Interpolated color as a hex string
 */
export const interpolateColor = (color1: string, color2: string, ratio: number): string => {
  // Convert colors to RGB components
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  if (!rgb1 || !rgb2) return color1;
  
  // Interpolate each component
  const r = Math.round(rgb1.r + ratio * (rgb2.r - rgb1.r));
  const g = Math.round(rgb1.g + ratio * (rgb2.g - rgb1.g));
  const b = Math.round(rgb1.b + ratio * (rgb2.b - rgb1.b));
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Parse a CSS color string into RGB components
 * 
 * @param color CSS color string (hex, rgb, or rgba)
 * @returns Object with r, g, b components or null if parsing failed
 */
export const parseColor = (color: string): {r: number, g: number, b: number} | null => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
  
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10)
      };
    }
  }
  
  return null;
};

/**
 * Generate a color scale for a range of values
 * 
 * @param min Minimum value
 * @param max Maximum value
 * @param steps Number of colors to generate
 * @param palette Color palette to use
 * @returns Array of colors
 */
export const generateColorScale = (
  min: number, 
  max: number, 
  steps = 9,
  palette = colorRanges.sequential
): string[] => {
  const scale = [];
  for (let i = 0; i < steps; i++) {
    const value = min + (i / (steps - 1)) * (max - min);
    const normalizedValue = (value - min) / (max - min);
    scale.push(getColorForValue(normalizedValue, palette));
  }
  return scale;
};

// Get a color scale based on data category
export const getColorScaleForCategory = (category?: string): string[] => {
  if (!category) return colorRanges.sequential;
  
  const lowerCategory = category.toLowerCase();
  
  // Return the appropriate color scale based on category
  if (lowerCategory.includes('energy')) return colorRanges.energy;
  if (lowerCategory.includes('electricity') || lowerCategory.includes('power')) return colorRanges.electricity;
  if (lowerCategory.includes('health')) return colorRanges.health;
  if (lowerCategory.includes('econom')) return colorRanges.economics;
  if (lowerCategory.includes('environment') || lowerCategory.includes('climate')) return colorRanges.environment;
  if (lowerCategory.includes('population') || lowerCategory.includes('demographic')) return colorRanges.population;
  if (lowerCategory.includes('educat')) return colorRanges.education;
  if (lowerCategory.includes('transport')) return colorRanges.transport;
  
  // Default to sequential
  return colorRanges.sequential;
};

// Format property values for display
export const formatPropertyValue = (value: any): string => {
  if (typeof value === 'number') {
    if (value % 1 !== 0) {
      return value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    return value.toLocaleString();
  }
  return String(value);
};

// Format property keys for display (convert snake_case or camelCase to Title Case)
export const formatPropertyKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};
