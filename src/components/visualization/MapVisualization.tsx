
import React, { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MapContainerComponent from './map/MapContainer';
import { findGeoPoints, calculateBounds } from './map/mapUtils';
import { useLeafletIconFix } from './map/useLeafletIconFix';

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
        }
      }
      // If we have data with lat/lng properties
      else if (data && Array.isArray(data) && data.length > 0) {
        const pointsData = findGeoPoints(data);
        
        if (pointsData.validPoints.length > 0) {
          // Fix: Calculate average latitude and longitude properly
          const sumLat = pointsData.validPoints.reduce((sum, p) => sum + p.lat, 0);
          const sumLng = pointsData.validPoints.reduce((sum, p) => sum + p.lng, 0);
          const avgLat = sumLat / pointsData.validPoints.length;
          const avgLng = sumLng / pointsData.validPoints.length;
          
          setMapCenter([avgLat, avgLng]);
          setMapZoom(5);
        }
      }
    } catch (error) {
      console.error("Error processing geographic data:", error);
    }
  }, [data, geoJSON, isLoading]);

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
        <div className="w-full h-[450px] rounded-md overflow-hidden border border-border">
          <MapContainerComponent
            center={mapCenter}
            zoom={mapZoom}
            geoJSON={processedGeoJSON}
            points={pointsData.validPoints}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
