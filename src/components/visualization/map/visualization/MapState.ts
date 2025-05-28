
import { useState } from 'react';

export interface MapState {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  anomalyDetection: boolean;
  anomalyThreshold: number;
  timeIndex: number;
  activeLayers: string[];
  isAnalyzingCorrelation: boolean;
  correlationValue: number | null;
  primaryLayer: string;
  secondaryLayer: string;
  blendMode: string;
  opacity: number;
  sidebarCollapsed: boolean;
}

export const useMapState = (): [MapState, {
  setVisualizationType: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
  setAnomalyDetection: (enabled: boolean) => void;
  setAnomalyThreshold: (threshold: number) => void;
  setTimeIndex: (index: number) => void;
  setActiveLayers: (layers: string[]) => void;
  setIsAnalyzingCorrelation: (analyzing: boolean) => void;
  setCorrelationValue: (value: number | null) => void;
  setPrimaryLayer: (layer: string) => void;
  setSecondaryLayer: (layer: string) => void;
  setBlendMode: (mode: string) => void;
  setOpacity: (opacity: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}] => {
  const [visualizationType, setVisualizationType] = useState<'standard' | 'choropleth' | 'heatmap' | 'cluster'>('standard');
  const [anomalyDetection, setAnomalyDetection] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState(2);
  const [timeIndex, setTimeIndex] = useState(0);
  const [activeLayers, setActiveLayers] = useState<string[]>(['base', 'data']);
  const [isAnalyzingCorrelation, setIsAnalyzingCorrelation] = useState(false);
  const [correlationValue, setCorrelationValue] = useState<number | null>(null);
  const [primaryLayer, setPrimaryLayer] = useState('temperature');
  const [secondaryLayer, setSecondaryLayer] = useState('precipitation');
  const [blendMode, setBlendMode] = useState('normal');
  const [opacity, setOpacity] = useState(0.7);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const state: MapState = {
    visualizationType,
    anomalyDetection,
    anomalyThreshold,
    timeIndex,
    activeLayers,
    isAnalyzingCorrelation,
    correlationValue,
    primaryLayer,
    secondaryLayer,
    blendMode,
    opacity,
    sidebarCollapsed
  };

  return [state, {
    setVisualizationType,
    setAnomalyDetection,
    setAnomalyThreshold,
    setTimeIndex,
    setActiveLayers,
    setIsAnalyzingCorrelation,
    setCorrelationValue,
    setPrimaryLayer,
    setSecondaryLayer,
    setBlendMode,
    setOpacity,
    setSidebarCollapsed
  }];
};
