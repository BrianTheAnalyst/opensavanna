
import React from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

interface ClusterMarkersProps {
  points: Array<{
    lat: number;
    lng: number;
    name?: string;
    value?: number;
  }>;
}

const ClusterMarkers: React.FC<ClusterMarkersProps> = ({ points }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!map || !points.length) return;
    
    // Create marker cluster group
    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true
    });
    
    // Add markers to the cluster group
    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng]);
      
      // Add tooltip with name and value if available
      if (point.name || point.value !== undefined) {
        const tooltipContent = `
          ${point.name ? `<strong>${point.name}</strong>` : ''}
          ${point.value !== undefined ? `<div>Value: ${point.value}</div>` : ''}
        `;
        marker.bindTooltip(tooltipContent);
      }
      
      markers.addLayer(marker);
    });
    
    // Add the cluster group to the map
    map.addLayer(markers);
    
    // Clean up on unmount
    return () => {
      map.removeLayer(markers);
    };
  }, [map, points]);
  
  // This component doesn't render anything directly
  return null;
};

export default ClusterMarkers;
