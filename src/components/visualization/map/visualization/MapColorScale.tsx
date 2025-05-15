
import React from 'react';

interface MapColorScaleProps {
  processedGeoJSON: any;
}

export const useColorScale = (processedGeoJSON: any) => {
  // Get color scale for legend
  const colorScale = processedGeoJSON 
    ? Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        return t < 0.33 ? `rgb(${Math.round(255 * (1-t*3))}, ${Math.round(255)}, 0)` :
               t < 0.66 ? `rgb(0, ${Math.round(255 * (1-(t-0.33)*3))}, ${Math.round(255 * (t-0.33)*3)})` :
               `rgb(${Math.round(255 * (t-0.66)*3)}, 0, ${Math.round(255 * (1-(t-0.66)*3))})`;
      })
    : [];

  // Min and max values for legend with type safety
  const minMaxField = processedGeoJSON?.metadata?.numericFields 
    ? (Object.values(processedGeoJSON.metadata.numericFields)[0] as any)
    : undefined;
    
  const minValue = minMaxField?.min ?? 0;
  const maxValue = minMaxField?.max ?? 100;
  
  return { colorScale, minValue, maxValue };
};

const MapColorScale: React.FC<MapColorScaleProps> = ({ processedGeoJSON }) => {
  const { colorScale } = useColorScale(processedGeoJSON);
  
  return (
    <div className="flex flex-row gap-1">
      {colorScale.map((color, index) => (
        <div
          key={index}
          style={{ backgroundColor: color }}
          className="w-5 h-5"
        />
      ))}
    </div>
  );
};

export default MapColorScale;
