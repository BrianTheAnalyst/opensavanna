
import React from 'react';
import { Marker, CircleMarker, Popup } from 'react-leaflet';

interface Point {
  lat: number;
  lng: number;
  name?: string;
  value?: number;
}

interface PointMarkersProps {
  points: Point[];
}

const PointMarkers: React.FC<PointMarkersProps> = ({ points }) => {
  return (
    <>
      {points.map((point, index) => (
        point.value ? (
          // @ts-ignore - Type definitions for react-leaflet don't match exactly
          <CircleMarker 
            key={index}
            center={[point.lat, point.lng]}
            radius={Math.min(10, Math.max(5, point.value / 10))}
            fillColor="#8B5CF6"
            color="#6D28D9"
            weight={1}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              {point.name && <div><strong>{point.name}</strong></div>}
              {point.value && <div>Value: {point.value}</div>}
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
      ))}
    </>
  );
};

export default PointMarkers;
