
import { TileLayerConfig } from '../types';

/**
 * Returns the appropriate tile layer configuration based on visualization type
 */
export const getTileLayer = (visualizationType: string): TileLayerConfig => {
  switch (visualizationType) {
    case 'choropleth':
      // For choropleth, use a minimal light background
      return {
        url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        attributionControl: true
      };
    case 'heatmap':
      // For heatmap, use a dark background
      return {
        url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        attributionControl: true
      };
    case 'cluster':
      // For cluster view, use a light detailed background
      return {
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attributionControl: true
      };
    default:
      // For standard, use the default OSM tiles
      return {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attributionControl: true
      };
  }
};
