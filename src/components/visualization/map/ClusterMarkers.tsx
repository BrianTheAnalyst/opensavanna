
import L from 'leaflet';
import React from 'react';
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
    
    // Check if leaflet.markercluster is available
    if (!L.MarkerClusterGroup) {
      console.error("Leaflet MarkerClusterGroup plugin not loaded");
      return;
    }
    
    // Create marker cluster group with enhanced options
    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      // Custom cluster icon styles
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        let className = 'marker-cluster-small';
        
        if (count > 100) {
          size = 'large';
          className = 'marker-cluster-large';
        } else if (count > 20) {
          size = 'medium';
          className = 'marker-cluster-medium';
        }
        
        return new L.DivIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: new L.Point(40, 40)
        });
      }
    });
    
    // Add markers to the cluster group with improved tooltips
    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        title: point.name || 'Location',
        riseOnHover: true
      });
      
      // Add enhanced tooltip with name and value if available
      if (point.name || point.value !== undefined) {
        const tooltipContent = `
          ${point.name ? `<strong>${point.name}</strong>` : ''}
          ${point.value !== undefined ? `<div>Value: ${point.value.toLocaleString()}</div>` : ''}
        `;
        marker.bindTooltip(tooltipContent, { 
          direction: 'top',
          offset: L.point(0, -10),
          className: 'custom-tooltip'
        });
      }
      
      markers.addLayer(marker);
    });
    
    // Add the cluster group to the map
    map.addLayer(markers);
    
    // Fit bounds to show all markers if we have points
    if (points.length > 1) {
      try {
        const bounds = markers.getBounds();
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 12,
          animate: true
        });
      } catch (e) {
        console.error("Error fitting bounds:", e);
      }
    }
    
    // Clean up on unmount
    return () => {
      map.removeLayer(markers);
    };
  }, [map, points]);
  
  // This component doesn't render anything directly
  return null;
};

export default ClusterMarkers;
