
import { useState } from 'react';

export const useMapState = () => {
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap' | 'cluster'>('standard');
  const [anomalyDetection, setAnomalyDetection] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState(2);
  const [timeIndex, setTimeIndex] = useState(0);
  const [activeLayers, setActiveLayers] = useState<string[]>(['base', 'data']);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return {
    visualizationType,
    setVisualizationType,
    anomalyDetection,
    setAnomalyDetection,
    anomalyThreshold,
    setAnomalyThreshold,
    timeIndex,
    setTimeIndex,
    activeLayers,
    setActiveLayers,
    sidebarCollapsed,
    setSidebarCollapsed
  };
};
