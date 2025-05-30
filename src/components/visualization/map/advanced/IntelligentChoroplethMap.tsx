
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { MapPoint, AdvancedMapConfig, ChoroplethData } from './types';
import { calculateChoroplethValues } from './utils/choroplethUtils';
import { getIntelligentColorScale } from './utils/colorScales';

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
  // Process choropleth data with intelligent binning
  const choroplethData = useMemo(() => {
    if (!geoJSON || !points.length) return [];
    
    return calculateChoroplethValues(geoJSON, points, {
      binningMethod: 'quantile',
      bins: 7,
      smoothing: config.spatialSmoothing,
      timeIndex: currentTimeIndex
    });
  }, [geoJSON, points, config.spatialSmoothing, currentTimeIndex]);

  // Get intelligent color scale
  const colorScale = useMemo(() => {
    return getIntelligentColorScale(config.colorScheme, choroplethData);
  }, [config.colorScheme, choroplethData]);

  // Style function for GeoJSON features
  const getFeatureStyle = (feature: any) => {
    const choroplethItem = choroplethData.find(item => 
      item.feature.properties.id === feature.properties.id ||
      item.feature.properties.name === feature.properties.name
    );
    
    if (!choroplethItem) {
      return {
        fillColor: '#f0f0f0',
        weight: 1,
        opacity: 0.7,
        color: '#999',
        fillOpacity: 0.5
      };
    }
    
    const isAnomaly = config.anomalyDetection && choroplethItem.isOutlier;
    
    return {
      fillColor: colorScale(choroplethItem.normalizedValue),
      weight: isAnomaly ? 3 : 1,
      opacity: isAnomaly ? 1.0 : 0.7,
      color: isAnomaly ? '#ff0000' : '#333',
      dashArray: isAnomaly ? '5,5' : '',
      fillOpacity: 0.8
    };
  };

  // Feature interaction handlers
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const choroplethItem = choroplethData.find(item => 
      item.feature.properties.id === feature.properties.id ||
      item.feature.properties.name === feature.properties.name
    );
    
    if (choroplethItem) {
      const popupContent = `
        <div class="space-y-2">
          <h3 class="font-semibold">${feature.properties.name || 'Region'}</h3>
          <p><strong>Value:</strong> ${choroplethItem.value.toFixed(2)}</p>
          <p><strong>Rank:</strong> ${choroplethItem.rank} of ${choroplethData.length}</p>
          ${choroplethItem.isOutlier ? '<p class="text-red-600 font-semibold">⚠️ Statistical Outlier</p>' : ''}
          ${spatialAnalysis?.hotspots?.some((hs: any) => hs.id === feature.properties.id) ? 
            '<p class="text-orange-600 font-semibold">🔥 Hotspot</p>' : ''}
        </div>
      `;
      
      layer.bindPopup(popupContent);
      
      // Hover effects
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#000',
            fillOpacity: 0.9
          });
          layer.bringToFront();
        },
        mouseout: (e) => {
          // Reset style
          e.target.setStyle(getFeatureStyle(feature));
        }
      });
    }
  };

  if (!geoJSON) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">No geographic boundaries available for choropleth mapping</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      <GeoJSON
        data={geoJSON}
        pathOptions={getFeatureStyle}
        onEachFeature={onEachFeature}
      />
      
      {/* Legend */}
      <div className="leaflet-bottom leaflet-right">
        <div className="bg-white p-3 rounded shadow-lg border">
          <h4 className="font-semibold mb-2">Data Intensity</h4>
          <div className="space-y-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(value => (
              <div key={value} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 border"
                  style={{ backgroundColor: colorScale(value) }}
                />
                <span className="text-xs">
                  {value === 0 ? 'Low' : value === 1 ? 'High' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MapContainer>
  );
};

export default IntelligentChoroplethMap;
