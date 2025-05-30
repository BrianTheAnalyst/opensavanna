
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPoint, AdvancedMapConfig } from './types';
import { getColorForValue } from './utils/colorScales';
import { processGeoJSONForChoropleth } from './utils/choroplethUtils';

interface IntelligentChoroplethMapProps {
  points: MapPoint[];
  geoJSON?: any;
  config: AdvancedMapConfig;
  currentTimeIndex: number;
  spatialAnalysis?: any;
  onConfigChange: (config: AdvancedMapConfig) => void;
}

const IntelligentChoroplethMap: React.FC<IntelligentChoroplethMapProps> = ({
  points,
  geoJSON,
  config,
  currentTimeIndex,
  spatialAnalysis
}) => {
  // Filter points by time if temporal data exists
  const timeFilteredPoints = useMemo(() => {
    return points.filter(point => 
      point.timeIndex === undefined || point.timeIndex === currentTimeIndex
    );
  }, [points, currentTimeIndex]);

  // Process GeoJSON data for choropleth
  const choroplethData = useMemo(() => {
    if (!geoJSON) return null;
    return processGeoJSONForChoropleth(geoJSON, timeFilteredPoints, config.colorScheme);
  }, [geoJSON, timeFilteredPoints, config.colorScheme]);

  // Calculate center of map
  const mapCenter = useMemo(() => {
    if (timeFilteredPoints.length === 0) return [20, 0] as [number, number];
    
    const avgLat = timeFilteredPoints.reduce((sum, p) => sum + p.lat, 0) / timeFilteredPoints.length;
    const avgLng = timeFilteredPoints.reduce((sum, p) => sum + p.lng, 0) / timeFilteredPoints.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [timeFilteredPoints]);

  // Style function for GeoJSON features
  const getFeatureStyle = (feature: any) => {
    if (!choroplethData) {
      return {
        fillColor: '#3388ff',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

    const featureData = choroplethData.features.find(f => 
      f.properties.id === feature.properties.id || 
      f.properties.name === feature.properties.name
    );

    if (!featureData) {
      return {
        fillColor: '#cccccc',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3
      };
    }

    const color = getColorForValue(featureData.value, choroplethData.valueRange, config.colorScheme);
    
    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  // Handle feature events
  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getFeatureStyle(feature));
      }
    });
  };

  return (
    <Card className="shadow-sm border border-border/50">
      <CardContent className="p-0">
        <div className="relative h-[500px] w-full rounded-md overflow-hidden">
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            className="rounded-md z-10"
            {...{
              center: mapCenter,
              zoom: 6,
              key: `choropleth-${mapCenter[0]}-${mapCenter[1]}-6`
            } as any}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            {geoJSON && (
              <GeoJSON
                data={geoJSON}
                {...{
                  pathOptions: getFeatureStyle,
                  onEachFeature: onEachFeature
                } as any}
              />
            )}
          </MapContainer>
          
          {/* Info Panel - Positioned with proper spacing */}
          <div className="absolute top-4 left-4 z-20 space-y-2">
            <Card className="shadow-lg border-border/20 bg-background/95 backdrop-blur-sm">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Choropleth Analysis
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{timeFilteredPoints.length} data points</p>
                  <p className="text-muted-foreground">Color scheme: {config.colorScheme}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentChoroplethMap;
