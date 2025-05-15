
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  
  // Fix for Leaflet marker icons in production builds
  useLeafletIconFix();
  
  // Get map data from custom hook with optimizations
  const { 
    hasGeoData,
    mapCenter,
    mapZoom,
    processedGeoJSON,
    pointsData,
    isSimplifying,
    processingError,
    progress
  } = useMapData(data, geoJSON, isLoading);
  
  // Get color scale from custom hook
  const { colorScale, minValue, maxValue } = useColorScale(processedGeoJSON);

  // Handle loading state
  if (isLoading) {
    return <MapLoadingState title={title} description={description} />;
  }

  // Handle empty state
  if (!hasGeoData && !isSimplifying) {
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
        
        {/* Show progress bar during GeoJSON processing */}
        {isSimplifying && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Optimizing geographic data...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* Show error if processing failed */}
        {processingError && (
          <div className="mb-4 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
            Error processing geographic data: {processingError}
          </div>
        )}
        
        <div className="w-full h-[450px] rounded-md overflow-hidden border border-border relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            geoJSON={processedGeoJSON}
            points={pointsData.validPoints}
            visualizationType={visualizationType}
            category={category}
            currentTimeIndex={currentTimeIndex}
          />
          
          {visualizationType === 'choropleth' && processedGeoJSON && (
            <MapLegend
              min={minValue}
              max={maxValue}
              colorScale={colorScale}
              title={category || 'Data Distribution'}
            />
          )}
          
          {/* Add loading overlay for simplification progress */}
          {isSimplifying && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <div className="bg-card p-4 rounded-lg shadow-lg max-w-sm">
                <h3 className="font-medium mb-2">Optimizing Map Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Processing geographic information for better performance...
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
