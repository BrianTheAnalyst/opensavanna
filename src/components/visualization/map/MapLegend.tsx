
import React from 'react';

interface MapLegendProps {
  min: number;
  max: number;
  colorScale: string[];
  title: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ min, max, colorScale, title }) => {
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
    const range = max - min;
    const steps = colorScale.length - 1;
    
    for (let i = 0; i <= steps; i++) {
      const value = min + (range * i) / steps;
      labels.push(formatNumber(value));
    }
    
    return labels;
  };

  const labels = generateLabels();

  return (
    <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md z-[1000]">
      <div className="text-xs font-medium mb-1">{title}</div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div 
            className="h-5 flex-1"
            style={{
              background: `linear-gradient(to right, ${colorScale.join(', ')})`,
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
