
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
      />
      
      {/* Main Layout Container */}
      <MapVisualizationLayout {...layoutProps} />
      
      {/* Show notice when using sample data */}
      {(!data || data.length === 0) && (
        <div className="mt-4 bg-muted/20 border border-border rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Sample geographic data is being displayed for demonstration purposes. 
            Upload a file with geographic coordinates to see actual location data.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapVisualizationContent;
