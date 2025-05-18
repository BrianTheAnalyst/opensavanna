
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface MapLayerControlsProps {
  activeLayers: string[];
  setActiveLayers: (layers: string[]) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  activeLayers,
  setActiveLayers,
  sidebarCollapsed,
  toggleSidebar
}) => {
  return (
    <div className="mt-4 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <Switch
          id="show-labels"
          checked={activeLayers.includes('labels')}
          onCheckedChange={(checked) => {
            if (checked) {
              setActiveLayers([...activeLayers, 'labels']);
            } else {
              setActiveLayers(activeLayers.filter(layer => layer !== 'labels'));
            }
          }}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="show-labels" className="text-sm">Show Map Labels</Label>
      </div>
      
      <div className="ml-auto">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleSidebar}
          className="border border-border/40 hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? (
            <>
              <ChevronLeft className="mr-1 h-4 w-4" /> Show Controls
            </>
          ) : (
            <>
              Hide Controls <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MapLayerControls;
