
import React, { useEffect, useState } from 'react';

import { colorRanges, getColorScaleForCategory } from './utils/colorUtils';

interface MapLegendProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  geoJSON?: any;
  category?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ visualizationType, geoJSON, category = 'Default' }) => {
  const [legendData, setLegendData] = useState({
    min: 0,
    max: 100,
    colorScale: [] as string[],
    title: category || 'Data Values',
    unit: ''
  });

  useEffect(() => {
    if (!geoJSON && visualizationType !== 'choropleth' && visualizationType !== 'heatmap') {
      // Don't show legend for non-data visualizations
      return;
    }
    
    // Get color scale for the category
    const colorScale = visualizationType === 'heatmap' 
      ? colorRanges.heatmap 
      : getColorScaleForCategory(category);
      
    // Default legend data
    const defaultData = {
      min: 0,
      max: 100,
      colorScale,
      title: visualizationType === 'heatmap' 
        ? 'Density' 
        : category || 'Data Values',
      unit: ''
    };
    
    // If we have GeoJSON data, extract metadata from it
    if (geoJSON) {
      try {
        const metadata = geoJSON.metadata || {};
        
        // Look for value field in metadata
        if (metadata.numericFields) {
          const valueField = Object.values(metadata.numericFields)[0] as any;
          if (valueField) {
            defaultData.min = valueField.min || 0;
            defaultData.max = valueField.max || 100;
          }
        }
        
        // Set title and unit if available
        if (metadata.title) defaultData.title = metadata.title;
        if (metadata.category) defaultData.title = metadata.category;
        if (metadata.unit) defaultData.unit = metadata.unit;
        
      } catch (error) {
        console.error('Error extracting legend data from GeoJSON:', error);
      }
    }
    
    setLegendData(defaultData);
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
    // Ensure we have a color scale
    if (legendData.colorScale.length === 0) {
      return [formatNumber(legendData.min), formatNumber(legendData.max)];
    }
    
    const labels = [];
    const range = legendData.max - legendData.min;
    const steps = legendData.colorScale.length - 1 || 4;
    
    for (let i = 0; i <= steps; i++) {
      const value = legendData.min + (range * i) / steps;
      labels.push(formatNumber(value));
    }
    
    return labels;
  };

  const labels = generateLabels();
  
  // Build the color gradient
  const colorGradient = legendData.colorScale.length > 0 
    ? `linear-gradient(to right, ${legendData.colorScale.join(', ')})`
    : `linear-gradient(to right, ${colorRanges.sequential.join(', ')})`;

  return (
    <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-gray-800/95 p-3 rounded-md shadow-md z-[1000] min-w-[180px] text-foreground">
      <div className="text-xs font-medium mb-1 flex items-center justify-between">
        <span>{legendData.title}</span>
        {legendData.unit && <span className="text-muted-foreground text-[10px]">{legendData.unit}</span>}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div 
            className="h-6 flex-1 rounded-sm"
            style={{
              background: colorGradient,
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
