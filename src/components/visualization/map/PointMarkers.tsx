
import React from 'react';
import { Marker, CircleMarker, Popup } from 'react-leaflet';

interface Point {
  lat: number;
  lng: number;
  name?: string;
  value?: number;
  isAnomaly?: boolean;
  zScore?: number;
}

interface PointMarkersProps {
  points: Point[];
  highlightAnomalies?: boolean;
}

const PointMarkers: React.FC<PointMarkersProps> = ({ points, highlightAnomalies = false }) => {
  return (
    <>
      {points.map((point, index) => {
        // Determine if this point should be highlighted as an anomaly
        const isHighlighted = highlightAnomalies && point.isAnomaly;
        
        // Choose color based on anomaly status
        const fillColor = isHighlighted ? "#FF4136" : "#8B5CF6";
        const color = isHighlighted ? "#B10DC9" : "#6D28D9";
        const radius = isHighlighted ? 
          Math.min(15, Math.max(8, (point.value || 1) / 8)) : 
          Math.min(10, Math.max(5, (point.value || 1) / 10));
        
        return point.value ? (
          // Use pathOptions for styling the CircleMarker according to react-leaflet v4 API
          <CircleMarker 
            key={index}
            center={[point.lat, point.lng]}
            pathOptions={{
              radius,
              fillColor,
              color,
              weight: isHighlighted ? 2 : 1,
              opacity: isHighlighted ? 1.0 : 0.8,
              fillOpacity: isHighlighted ? 0.8 : 0.6
            }}
          >
            <Popup>
              {point.name && <div><strong>{point.name}</strong></div>}
              {point.value && <div>Value: {point.value}</div>}
              {isHighlighted && point.zScore !== undefined && (
                <div className="text-red-600 font-semibold mt-2">
                  Anomaly detected (z-score: {point.zScore.toFixed(2)})
                </div>
              )}
              <div>Latitude: {point.lat}</div>
              <div>Longitude: {point.lng}</div>
            </Popup>
          </CircleMarker>
        ) : (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>
              {point.name && <div><strong>{point.name}</strong></div>}
              <div>Latitude: {point.lat}</div>
              <div>Longitude: {point.lng}</div>
            </Popup>
          </Marker>
        )
      })}
    </>
  );
};

export default PointMarkers;
