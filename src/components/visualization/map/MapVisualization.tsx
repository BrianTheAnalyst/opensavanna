
import React, { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MapContainerComponent from './map/MapContainer';
import { findGeoPoints, calculateBounds } from './map/mapUtils';
import { useLeafletIconFix } from './map/useLeafletIconFix';
import MapLegend from './map/MapLegend';
import MapControls from './map/MapControls';

// Interface for props
interface MapVisualizationProps {
  data: any;
  title?: string;
  description?: string;
  isLoading?: boolean;
  geoJSON?: any;
  category?: string;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  data,
  title = "Geographic Data Visualization",
  description = "Exploring spatial patterns and geographic distributions",
  isLoading = false,
  geoJSON,
  category
}) => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [processedGeoJSON, setProcessedGeoJSON] = useState<any>(null);
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap'>('choropleth');
  const [legendData, setLegendData] = useState<{min: number, max: number, colorScale: string[]}>({ min: 0, max: 0, colorScale: [] });
  
  // Fix for Leaflet marker icons in production builds
  useLeafletIconFix();
  
  // Process data for map visualization
  useEffect(() => {
    if (isLoading) return;
    
    try {
      // If we have direct GeoJSON data
      if (geoJSON) {
        setProcessedGeoJSON(geoJSON);
        
        // Try to center the map on the data
        if (geoJSON.features && geoJSON.features.length > 0) {
          const bounds = calculateBounds(geoJSON);
          if (bounds) {
            setMapCenter([(bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2]);
            
            // Adjust zoom based on the size of the area
            const latSpan = Math.abs(bounds.north - bounds.south);
            const lngSpan = Math.abs(bounds.east - bounds.west);
            const span = Math.max(latSpan, lngSpan);
            
            if (span < 1) setMapZoom(10);
            else if (span < 5) setMapZoom(7);
            else if (span < 20) setMapZoom(5);
            else setMapZoom(3);
          }
          
          // Extract min/max values for choropleth legend
          if (visualizationType === 'choropleth') {
            const values: number[] = [];
            geoJSON.features.forEach((feature: any) => {
              const value = findValueInFeature(feature);
              if (typeof value === 'number' && !isNaN(value)) {
                values.push(value);
              }
            });
            
            if (values.length > 0) {
              const min = Math.min(...values);
              const max = Math.max(...values);
              setLegendData({
                min,
                max,
                colorScale: generateColorScale(5)
              });
            }
          }
        }
      }
      // If we have data with lat/lng properties
      else if (data && Array.isArray(data) && data.length > 0) {
        const pointsData = findGeoPoints(data);
        
        if (pointsData.validPoints.length > 0) {
          // Calculate average latitude and longitude correctly
          let sumLat = 0;
          let sumLng = 0;
          
          pointsData.validPoints.forEach(point => {
            sumLat += point.lat;
            sumLng += point.lng;
          });
          
          const avgLat = sumLat / pointsData.validPoints.length;
          const avgLng = sumLng / pointsData.validPoints.length;
          
          setMapCenter([avgLat, avgLng]);
          setMapZoom(5);
        }
      }
    } catch (error) {
      console.error("Error processing geographic data:", error);
    }
  }, [data, geoJSON, isLoading, visualizationType]);

  // Function to find value in a GeoJSON feature
  const findValueInFeature = (feature: any): number | null => {
    if (!feature?.properties) return null;
    
    // Check for value properties that would be relevant for choropleth maps
    const valueProps = ['value', 'density', 'consumption', 'amount', 'population', 'count'];
    
    for (const prop of valueProps) {
      if (feature.properties[prop] !== undefined) {
        const value = parseFloat(feature.properties[prop]);
        if (!isNaN(value)) return value;
      }
    }
    
    // Try to find any numeric property as a fallback
    for (const key in feature.properties) {
      if (feature.properties[key] !== undefined) {
        const value = parseFloat(feature.properties[key]);
        if (!isNaN(value)) return value;
      }
    }
    
    return null;
  };
  
  // Generate color scale for choropleth map
  const generateColorScale = (steps: number): string[] => {
    // Predefined gradient from light to dark for choropleths
    const colorScales = {
      // Different color schemes for different data categories
      energy: ['#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'],
      health: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
      economics: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'],
      default: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']
    };
    
    // Select color scale based on category or use default
    const categoryKey = category?.toLowerCase() || 'default';
    const scale = (categoryKey.includes('energy') || categoryKey.includes('electric')) 
      ? colorScales.energy 
      : categoryKey.includes('health')
        ? colorScales.health
        : categoryKey.includes('econom') || categoryKey.includes('financ')
          ? colorScales.economics
          : colorScales.default;
          
    return scale;
  };

  // Handle visualization type change
  const handleVisualizationTypeChange = (type: 'standard' | 'choropleth' | 'heatmap') => {
    setVisualizationType(type);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[450px] bg-muted/30 rounded-md flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find point data (if no GeoJSON)
  const pointsData = !processedGeoJSON && data ? findGeoPoints(data) : { validPoints: [] };
  const hasGeoData = !!processedGeoJSON || pointsData.validPoints.length > 0;

  if (!hasGeoData) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[450px] bg-muted/30 rounded-md flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No geographic data found in this dataset.</p>
              <p className="text-sm text-muted-foreground">
                Geographic visualization requires GeoJSON data or coordinates (latitude/longitude).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
          onVisualizationTypeChange={handleVisualizationTypeChange}
        />
        <div className="w-full h-[450px] rounded-md overflow-hidden border border-border relative">
          <MapContainerComponent
            center={mapCenter}
            zoom={mapZoom}
            geoJSON={processedGeoJSON}
            points={pointsData.validPoints}
            visualizationType={visualizationType}
            category={category}
          />
          {visualizationType === 'choropleth' && legendData.min !== legendData.max && (
            <MapLegend 
              min={legendData.min} 
              max={legendData.max} 
              colorScale={legendData.colorScale} 
              title={category || 'Value'} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
