
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapContainer from '../MapContainer';
import { useLeafletIconFix } from '../useLeafletIconFix';
import MapLegend from '../MapLegend';
import MapControls from '../MapControls';
import MapLoadingState from './MapLoadingState';
import MapEmptyState from './MapEmptyState';
import { useMapData } from './useMapData';
import { useColorScale } from './MapColorScale';
import { MapVisualizationProps } from './types';

const MapVisualization: React.FC<MapVisualizationProps> = ({
  data,
  title = "Geographic Data Visualization",
  description = "Exploring spatial patterns and geographic distributions",
  isLoading = false,
  geoJSON,
  category
}) => {
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap' | 'cluster'>('standard');
  
  // Fix for Leaflet marker icons in production builds
  useLeafletIconFix();
  
  // Get map data from custom hook
  const { 
    hasGeoData,
    mapCenter,
    mapZoom,
    processedGeoJSON,
    pointsData
  } = useMapData(data, geoJSON, isLoading);
  
  // Get color scale from custom hook
  const { colorScale, minValue, maxValue } = useColorScale(processedGeoJSON);

  // Handle loading state
  if (isLoading) {
    return <MapLoadingState title={title} description={description} />;
  }

  // Handle empty state
  if (!hasGeoData) {
    return <MapEmptyState title={title} description={description} />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <MapControls 
          visualizationType={visualizationType} 
          onVisualizationTypeChange={setVisualizationType} 
        />
        <div className="w-full h-[450px] rounded-md overflow-hidden border border-border relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            geoJSON={processedGeoJSON}
            points={pointsData.validPoints}
            visualizationType={visualizationType}
            category={category}
          />
          {visualizationType === 'choropleth' && processedGeoJSON && (
            <MapLegend
              min={minValue}
              max={maxValue}
              colorScale={colorScale}
              title={category || 'Data Distribution'}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
