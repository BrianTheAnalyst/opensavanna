
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { MapPoint, AdvancedMapConfig } from './types';
import { performDBSCANClustering } from './utils/clusteringUtils';
import { getCategoricalColors } from './utils/colorScales';

interface DynamicClusterMapProps {
  points: MapPoint[];
  config: AdvancedMapConfig;
  currentTimeIndex: number;
  spatialAnalysis?: any;
  onConfigChange: (config: AdvancedMapConfig) => void;
}

const DynamicClusterMap: React.FC<DynamicClusterMapProps> = ({
  points,
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

  // Perform clustering
  const clusteredData = useMemo(() => {
    return performDBSCANClustering(timeFilteredPoints, config.clusterRadius, 3);
  }, [timeFilteredPoints, config.clusterRadius]);

  // Generate colors for clusters
  const clusterColors = useMemo(() => {
    const clusterIds = [...new Set(clusteredData.points.map(p => p.cluster).filter(c => c !== -1))];
    return getCategoricalColors(clusterIds.map(id => `Cluster ${id}`));
  }, [clusteredData.points]);

  // Calculate center of map
  const mapCenter = useMemo(() => {
    if (timeFilteredPoints.length === 0) return [20, 0] as [number, number];
    
    const avgLat = timeFilteredPoints.reduce((sum, p) => sum + p.lat, 0) / timeFilteredPoints.length;
    const avgLng = timeFilteredPoints.reduce((sum, p) => sum + p.lng, 0) / timeFilteredPoints.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [timeFilteredPoints]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Render clustered points */}
      {clusteredData.points.map((point) => {
        const isNoise = point.cluster === -1;
        const isAnomaly = config.anomalyDetection && point.isAnomaly;
        const isHotspot = spatialAnalysis?.hotspots?.some((hs: any) => hs.id === point.id);
        
        let color = '#999999'; // Default for noise
        let radius = 6;
        
        if (!isNoise) {
          color = clusterColors[`Cluster ${point.cluster}`] || '#3388ff';
          radius = Math.min(15, Math.max(6, Math.sqrt(point.value) * 2));
        }
        
        if (isAnomaly) {
          color = '#ff4444';
          radius += 2;
        }
        
        if (isHotspot) {
          color = '#ff8800';
          radius += 1;
        }

        return (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            pathOptions={{
              fillColor: color,
              color: isAnomaly ? '#ff0000' : '#ffffff',
              weight: isAnomaly ? 3 : 1,
              opacity: 0.8,
              fillOpacity: 0.7,
              radius: radius
            }}
          >
            <Popup>
              <div className="space-y-2">
                <h3 className="font-semibold">{point.properties?.name || 'Data Point'}</h3>
                <p><strong>Value:</strong> {point.value.toFixed(2)}</p>
                <p><strong>Cluster:</strong> {isNoise ? 'Noise' : `Cluster ${point.cluster}`}</p>
                {point.density && <p><strong>Density:</strong> {point.density.toFixed(2)}</p>}
                {isAnomaly && <p className="text-red-600 font-semibold">⚠️ Anomaly Detected</p>}
                {isHotspot && <p className="text-orange-600 font-semibold">🔥 Spatial Hotspot</p>}
                <p className="text-xs text-gray-600">
                  Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
      
      {/* Cluster centers */}
      {clusteredData.clusters.map((cluster) => (
        <CircleMarker
          key={`center-${cluster.id}`}
          center={cluster.center}
          pathOptions={{
            fillColor: clusterColors[`Cluster ${cluster.id}`] || '#3388ff',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.3,
            radius: 20
          }}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-semibold">Cluster {cluster.id} Center</h3>
              <p><strong>Points:</strong> {cluster.points.length}</p>
              <p><strong>Avg Value:</strong> {cluster.avgValue.toFixed(2)}</p>
              <p><strong>Variance:</strong> {cluster.variance.toFixed(2)}</p>
              <p className="text-xs text-gray-600">
                Center: {cluster.center[0].toFixed(4)}, {cluster.center[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      
      {/* Legend */}
      <div className="leaflet-bottom leaflet-right">
        <div className="bg-white p-3 rounded shadow-lg border max-h-48 overflow-y-auto">
          <h4 className="font-semibold mb-2">Clusters</h4>
          <div className="space-y-1">
            {clusteredData.clusters.map(cluster => (
              <div key={cluster.id} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: clusterColors[`Cluster ${cluster.id}`] }}
                />
                <span className="text-xs">
                  Cluster {cluster.id} ({cluster.points.length} pts)
                </span>
              </div>
            ))}
            {clusteredData.points.some(p => p.cluster === -1) && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border bg-gray-400" />
                <span className="text-xs">Noise Points</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t text-xs text-gray-600">
            <p>Radius: {config.clusterRadius}km</p>
            <p>Total: {clusteredData.points.length} points</p>
          </div>
        </div>
      </div>
    </MapContainer>
  );
};

export default DynamicClusterMap;
