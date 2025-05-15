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
  // Color scales optimized for different data types
  const scales: Record<string, string[]> = {
    energy: ['#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'],
    electricity: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'], // Added specific scale for electricity
    power: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'], // Similar to electricity
    health: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#006d2c'],
    economics: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'],
    environment: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#00441b'],
    default: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']
  };

  // Find the most appropriate color scale
  let key = 'default';
  if (category) {
    const lowerCategory = category.toLowerCase();
    for (const scaleKey of Object.keys(scales)) {
      if (lowerCategory.includes(scaleKey)) {
        key = scaleKey;
        break;
      }
    }
  }

  return scales[key];
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
