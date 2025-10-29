
import React from 'react';
import MapHeader from '../MapHeader';
import MapVisualizationLayout from './MapVisualizationLayout';
import { MapVisualizationContentProps } from '../types';

const MapVisualizationContent: React.FC<MapVisualizationContentProps> = ({
  title,
  description,
  anomalyDetection,
  data,
  layoutProps
}) => {
  return (
    <div className="space-y-6">
      <MapHeader 
        title={title} 
        description={description} 
        anomalyDetection={anomalyDetection}
        data={data}
      />
      
      {/* Main Layout Container */}
      <MapVisualizationLayout {...layoutProps} />
    </div>
  );
};

export default MapVisualizationContent;
