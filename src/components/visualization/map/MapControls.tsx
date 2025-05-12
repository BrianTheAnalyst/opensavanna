
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, PieChart, Activity, Layers } from 'lucide-react'; // Added Activity icon for heatmap

interface MapControlsProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap' | 'cluster';
  onVisualizationTypeChange: (type: 'standard' | 'choropleth' | 'heatmap' | 'cluster') => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  visualizationType, 
  onVisualizationTypeChange 
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-muted-foreground mr-2">Map view:</span>
      <Button 
        size="sm" 
        variant={visualizationType === 'standard' ? 'default' : 'outline'} 
        onClick={() => onVisualizationTypeChange('standard')}
      >
        <Map className="h-4 w-4 mr-1" />
        Standard
      </Button>
      <Button 
        size="sm" 
        variant={visualizationType === 'choropleth' ? 'default' : 'outline'} 
        onClick={() => onVisualizationTypeChange('choropleth')}
      >
        <PieChart className="h-4 w-4 mr-1" />
        Choropleth
      </Button>
      <Button 
        size="sm" 
        variant={visualizationType === 'heatmap' ? 'default' : 'outline'} 
        onClick={() => onVisualizationTypeChange('heatmap')}
      >
        <Activity className="h-4 w-4 mr-1" /> {/* Using Activity icon for better heat representation */}
        Heatmap
      </Button>
      <Button 
        size="sm" 
        variant={visualizationType === 'cluster' ? 'default' : 'outline'} 
        onClick={() => onVisualizationTypeChange('cluster')}
      >
        <Layers className="h-4 w-4 mr-1" />
        Cluster
      </Button>
    </div>
  );
};

export default MapControls;
