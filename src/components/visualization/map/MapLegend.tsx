
import React, { useEffect, useState } from 'react';
import { colorRanges } from './utils/colorUtils';

interface MapLegendProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  geoJSON?: any;
  category?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ visualizationType, geoJSON, category = 'Default' }) => {
  const [legendData, setLegendData] = useState({
    min: 0,
    max: 100,
    colorScale: colorRanges.sequential,
    title: category || 'Data Values'
  });

  useEffect(() => {
    if (!geoJSON || visualizationType !== 'choropleth') {
      // Default legend for non-choropleth visualizations
      setLegendData({
        min: 0,
        max: 100,
        colorScale: visualizationType === 'heatmap' 
          ? colorRanges.heatmap 
          : colorRanges.sequential,
        title: visualizationType === 'heatmap' 
          ? 'Density' 
          : category || 'Data Values'
      });
      return;
    }
    
    // Extract min/max values from GeoJSON for choropleth maps
    try {
      const metadata = geoJSON.metadata || {};
      const numericFields = metadata.numericFields || {};
      const valueField = numericFields.value || {};
      
      setLegendData({
        min: valueField.min || 0,
        max: valueField.max || 100,
        colorScale: colorRanges.sequential,
        title: metadata.category || category || 'Data Values'
      });
    } catch (error) {
      console.error('Error extracting legend data from GeoJSON:', error);
    }
  }, [visualizationType, geoJSON, category]);

  // Don't display legend for standard maps unless they have GeoJSON
  if (visualizationType === 'standard' && !geoJSON) {
    return null;
  }
  
  // Don't display legend for cluster maps
  if (visualizationType === 'cluster') {
    return null;
  }

  // Format numbers for better readability
  const formatNumber = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toFixed(value % 1 === 0 ? 0 : 1);
    }
  };

  // Generate intermediate labels
  const generateLabels = () => {
    const labels = [];
    const range = legendData.max - legendData.min;
    const steps = legendData.colorScale.length - 1;
    
    for (let i = 0; i <= steps; i++) {
      const value = legendData.min + (range * i) / steps;
      labels.push(formatNumber(value));
    }
    
    return labels;
  };

  const labels = generateLabels();

  return (
    <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md z-[1000]">
      <div className="text-xs font-medium mb-1">{legendData.title}</div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div 
            className="h-5 flex-1"
            style={{
              background: `linear-gradient(to right, ${legendData.colorScale.join(', ')})`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {labels.map((label, idx) => (
            <div 
              key={idx} 
              className="text-xs" 
              style={{ 
                width: `${100 / (labels.length - 1)}%`, 
                textAlign: idx === 0 ? 'left' : idx === labels.length - 1 ? 'right' : 'center',
                marginLeft: idx === 0 ? '0' : '-50%',
                marginRight: idx === labels.length - 1 ? '0' : '-50%'
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
