
import { ChoroplethData } from '../types';

/**
 * Intelligent color scale generator based on data characteristics
 */
export const getIntelligentColorScale = (
  scheme: string, 
  data: ChoroplethData[]
): (value: number) => string => {
  const colors = getColorScheme(scheme);
  
  // Analyze data distribution
  const values = data.map(d => d.value).sort((a, b) => a - b);
  const min = values[0] || 0;
  const max = values[values.length - 1] || 1;
  
  // Detect if data is skewed and adjust accordingly
  const median = values[Math.floor(values.length / 2)];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const skewness = (mean - median) / (max - min);
  
  // Choose interpolation method based on data distribution
  if (Math.abs(skewness) > 0.3) {
    // Use logarithmic scale for skewed data
    return createLogScale(colors, min, max);
  } else {
    // Use linear scale for normal distribution
    return createLinearScale(colors, min, max);
  }
};

/**
 * Get color schemes optimized for different data types
 */
const getColorScheme = (scheme: string): string[] => {
  const schemes: Record<string, string[]> = {
    viridis: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
    plasma: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
    inferno: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'],
    magma: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf'],
    turbo: ['#30123b', '#4777ef', '#1ac7c2', '#5eb95b', '#afbc2f', '#fbc127', '#f8765c'],
    spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2']
  };
  
  return schemes[scheme] || schemes.viridis;
};

/**
 * Create linear color scale
 */
const createLinearScale = (colors: string[], min: number, max: number) => {
  return (value: number): string => {
    if (value <= min) return colors[0];
    if (value >= max) return colors[colors.length - 1];
    
    const normalized = (value - min) / (max - min);
    const position = normalized * (colors.length - 1);
    const index = Math.floor(position);
    const fraction = position - index;
    
    if (index >= colors.length - 1) return colors[colors.length - 1];
    
    return interpolateColor(colors[index], colors[index + 1], fraction);
  };
};

/**
 * Create logarithmic color scale for skewed data
 */
const createLogScale = (colors: string[], min: number, max: number) => {
  const logMin = Math.log(Math.max(min, 0.001));
  const logMax = Math.log(max);
  
  return (value: number): string => {
    if (value <= min) return colors[0];
    if (value >= max) return colors[colors.length - 1];
    
    const logValue = Math.log(Math.max(value, 0.001));
    const normalized = (logValue - logMin) / (logMax - logMin);
    const position = normalized * (colors.length - 1);
    const index = Math.floor(position);
    const fraction = position - index;
    
    if (index >= colors.length - 1) return colors[colors.length - 1];
    
    return interpolateColor(colors[index], colors[index + 1], fraction);
  };
};

/**
 * Interpolate between two hex colors
 */
const interpolateColor = (color1: string, color2: string, fraction: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * fraction);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * fraction);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * fraction);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Generate categorical colors for discrete data
 */
export const getCategoricalColors = (categories: string[]): Record<string, string> => {
  const colors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];
  
  const colorMap: Record<string, string> = {};
  categories.forEach((category, index) => {
    colorMap[category] = colors[index % colors.length];
  });
  
  return colorMap;
};
