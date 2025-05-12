
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, CircleMarker } from 'react-leaflet';
import { LatLngExpression, Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
  useEffect(() => {
    // This is needed to properly display markers in Leaflet when using webpack/vite
    delete (window as any)._leaflet_id;
    
    const L = require('leaflet');
    
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Default colors for choropleth maps
  const colors = [
    '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1',
    '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'
  ];
  
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
          // Center map on the average position
          const avgLat = pointsData.validPoints.reduce((sum, p) => sum + p.lat, 0) / pointsData.validPoints.length;
          const avgLng = pointsData.validPoints.reduce((sum, p) => sum + p.lng, 0) / pointsData.validPoints.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(5);
        }
      }
    } catch (error) {
      console.error("Error processing geographic data:", error);
    }
  }, [data, geoJSON, isLoading]);

  // Helper function to calculate bounds from GeoJSON
  const calculateBounds = (geoJSON: any) => {
    if (!geoJSON || !geoJSON.features || !geoJSON.features.length) return null;
    
    let north = -90, south = 90, east = -180, west = 180;
    let hasValidCoordinates = false;
    
    // Process all features
    geoJSON.features.forEach((feature: any) => {
      if (!feature.geometry || !feature.geometry.coordinates) return;
      
      const processCoordinate = (coord: number[]) => {
        if (coord.length < 2) return;
        const lng = coord[0];
        const lat = coord[1];
        
        if (isFinite(lat) && isFinite(lng)) {
          north = Math.max(north, lat);
          south = Math.min(south, lat);
          east = Math.max(east, lng);
          west = Math.min(west, lng);
          hasValidCoordinates = true;
        }
      };
      
      const processCoordinatesArray = (coords: any[], depth = 0) => {
        if (coords.length === 0) return;
        
        if (depth > 0 && typeof coords[0] === 'number') {
          processCoordinate(coords);
        } else {
          coords.forEach(coord => processCoordinatesArray(coord, depth + 1));
        }
      };
      
      processCoordinatesArray(feature.geometry.coordinates);
    });
    
    return hasValidCoordinates ? { north, south, east, west } : null;
  };

  // Helper function to find geographic points in data
  const findGeoPoints = (data: any[]) => {
    const validPoints: { lat: number; lng: number; name?: string; value?: number }[] = [];
    const latField = findFieldByName(data[0], ['lat', 'latitude', 'y']);
    const lngField = findFieldByName(data[0], ['lng', 'longitude', 'lon', 'x']);
    
    if (latField && lngField) {
      data.forEach(item => {
        const lat = parseFloat(item[latField]);
        const lng = parseFloat(item[lngField]);
        
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          const nameField = findFieldByName(item, ['name', 'title', 'label']);
          const valueField = findFieldByName(item, ['value', 'data', 'count']);
          
          validPoints.push({
            lat,
            lng,
            name: nameField ? item[nameField] : undefined,
            value: valueField ? parseFloat(item[valueField]) : undefined
          });
        }
      });
    }
    
    return { validPoints, latField, lngField };
  };

  // Helper function to find a field by possible names
  const findFieldByName = (obj: any, possibleNames: string[]) => {
    if (!obj) return null;
    
    for (const name of possibleNames) {
      if (obj.hasOwnProperty(name)) return name;
    }
    
    return null;
  };

  // Style function for GeoJSON
  const styleFeature = (feature: any) => {
    // Default style
    const baseStyle = {
      weight: 1,
      opacity: 0.8,
      color: '#6366F1',
      fillOpacity: 0.5,
      fillColor: '#818CF8'
    };
    
    // If feature has properties with value, use it for choropleth coloring
    if (feature.properties) {
      const value = findValueInProperties(feature.properties);
      if (value !== null) {
        const colorIndex = Math.min(Math.floor(value * colors.length / 100), colors.length - 1);
        return {
          ...baseStyle,
          fillColor: colors[colorIndex]
        };
      }
    }
    
    return baseStyle;
  };

  // Find a numeric value in properties for choropleth mapping
  const findValueInProperties = (properties: any) => {
    if (!properties) return null;
    
    // Look for common value fields
    const valueFields = ['value', 'data', 'count', 'density', 'population'];
    
    for (const field of valueFields) {
      if (properties[field] !== undefined && !isNaN(parseFloat(properties[field]))) {
        return parseFloat(properties[field]);
      }
    }
    
    // Try to find any numeric property
    for (const key in properties) {
      if (properties[key] !== undefined && !isNaN(parseFloat(properties[key]))) {
        return parseFloat(properties[key]);
      }
    }
    
    return null;
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

  // Function for handling GeoJSON feature interactions
  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties) {
      const popupContent = Object.entries(feature.properties)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join('<br>');
      layer.bindPopup(popupContent);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[450px] rounded-md overflow-hidden border border-border">
          <MapContainer 
            center={mapCenter as [number, number]} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {processedGeoJSON && (
              <GeoJSON 
                data={processedGeoJSON}
                pathOptions={styleFeature({})}
                onEachFeature={onEachFeature}
              />
            )}
            
            {pointsData.validPoints.map((point, index) => (
              point.value ? (
                <CircleMarker 
                  key={index}
                  center={[point.lat, point.lng] as [number, number]}
                  pathOptions={{
                    radius: Math.min(10, Math.max(5, point.value / 10)),
                    fillColor: "#8B5CF6",
                    color: "#6D28D9",
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.6
                  }}
                >
                  <Popup>
                    {point.name && <div><strong>{point.name}</strong></div>}
                    {point.value && <div>Value: {point.value}</div>}
                    <div>Latitude: {point.lat}</div>
                    <div>Longitude: {point.lng}</div>
                  </Popup>
                </CircleMarker>
              ) : (
                <Marker key={index} position={[point.lat, point.lng] as [number, number]}>
                  <Popup>
                    {point.name && <div><strong>{point.name}</strong></div>}
                    <div>Latitude: {point.lat}</div>
                    <div>Longitude: {point.lng}</div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
