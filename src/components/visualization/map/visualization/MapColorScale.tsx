
import { useMemo } from 'react';

import { ColorScaleInfo } from './types';

export function useColorScale(geoJSON: any | null): ColorScaleInfo {
  return useMemo(() => {
    // Generate a color scale for choropleth maps
    const colorScale = Array.from({ length: 7 }, (_, i) => {
      const t = i / 6;
      return t < 0.33 ? `rgb(${Math.round(255 * (1-t*3))}, ${Math.round(255)}, 0)` :
             t < 0.66 ? `rgb(0, ${Math.round(255 * (1-(t-0.33)*3))}, ${Math.round(255 * (t-0.33)*3)})` :
             `rgb(${Math.round(255 * (t-0.66)*3)}, 0, ${Math.round(255 * (1-(t-0.66)*3))})`;
    });
    
    // Get min and max values from GeoJSON metadata
    const minMaxField = geoJSON?.metadata?.numericFields 
      ? Object.values(geoJSON.metadata.numericFields)[0] as { min: number, max: number } | undefined
      : undefined;
      
    const minValue = minMaxField?.min ?? 0;
    const maxValue = minMaxField?.max ?? 100;
    
    return { colorScale, minValue, maxValue };
  }, [geoJSON]);
}
