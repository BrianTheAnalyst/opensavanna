
import React from 'react';
import AdvancedMapVisualization from './map/advanced/AdvancedMapVisualization';

interface MapVisualizationProps {
  data: any[];
  geoJSON?: any;
  title?: string;
  description?: string;
  isLoading?: boolean;
  category?: string;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  data = [],
  geoJSON = null,
  title = 'Geographic Data Visualization',
  description = 'Interactive map showing spatial patterns and insights',
  isLoading = false,
  category = 'general'
}) => {
  return (
    <AdvancedMapVisualization
      data={data}
      geoJSON={geoJSON}
      title={title}
      description={description}
      category={category}
      isLoading={isLoading}
    />
  );
};

export default MapVisualization;
