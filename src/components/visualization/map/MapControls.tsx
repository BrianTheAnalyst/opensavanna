
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, PieChart, Map as MapIcon } from 'lucide-react'; // Using Map icon as fallback for Heat

interface MapControlsProps {
  visualizationType: 'standard' | 'choropleth' | 'heatmap';
  onVisualizationTypeChange: (type: 'standard' | 'choropleth' | 'heatmap') => void;
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
        <MapIcon className="h-4 w-4 mr-1" />
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
        <Map className="h-4 w-4 mr-1" /> {/* Using Map icon as fallback for heat */}
        Heatmap
      </Button>
    </div>
  );
};

export default MapControls;
