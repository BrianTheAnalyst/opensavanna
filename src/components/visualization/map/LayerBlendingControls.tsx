
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, MoveHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LayerBlendingControlsProps {
  primaryLayer: string;
  secondaryLayer: string;
  blendMode: string;
  blendOpacity: number;
  availableLayers: Array<{ id: string; name: string }>;
  onPrimaryLayerChange: (layerId: string) => void;
  onSecondaryLayerChange: (layerId: string) => void;
  onBlendModeChange: (mode: string) => void;
  onBlendOpacityChange: (opacity: number) => void;
}

const blendModes = [
  { id: 'normal', name: 'Normal' },
  { id: 'multiply', name: 'Multiply' },
  { id: 'screen', name: 'Screen' },
  { id: 'overlay', name: 'Overlay' },
  { id: 'darken', name: 'Darken' },
  { id: 'lighten', name: 'Lighten' },
  { id: 'color-dodge', name: 'Color Dodge' },
  { id: 'difference', name: 'Difference' }
];

const LayerBlendingControls: React.FC<LayerBlendingControlsProps> = ({
  primaryLayer,
  secondaryLayer,
  blendMode,
  blendOpacity,
  availableLayers,
  onPrimaryLayerChange,
  onSecondaryLayerChange,
  onBlendModeChange,
  onBlendOpacityChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          Layer Blending
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primary-layer" className="text-sm">Primary Layer</Label>
          <Select value={primaryLayer} onValueChange={onPrimaryLayerChange}>
            <SelectTrigger id="primary-layer">
              <SelectValue placeholder="Select a layer" />
            </SelectTrigger>
            <SelectContent>
              {availableLayers.map(layer => (
                <SelectItem key={layer.id} value={layer.id}>
                  {layer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center">
          <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary-layer" className="text-sm">Secondary Layer</Label>
          <Select value={secondaryLayer} onValueChange={onSecondaryLayerChange}>
            <SelectTrigger id="secondary-layer">
              <SelectValue placeholder="Select a layer" />
            </SelectTrigger>
            <SelectContent>
              {availableLayers.map(layer => (
                <SelectItem key={layer.id} value={layer.id}>
                  {layer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blend-mode" className="text-sm">Blend Mode</Label>
          <Select value={blendMode} onValueChange={onBlendModeChange}>
            <SelectTrigger id="blend-mode">
              <SelectValue placeholder="Blend mode" />
            </SelectTrigger>
            <SelectContent>
              {blendModes.map(mode => (
                <SelectItem key={mode.id} value={mode.id}>
                  {mode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="blend-opacity" className="text-sm">Blend Opacity</Label>
            <span className="text-xs text-muted-foreground">
              {Math.round(blendOpacity * 100)}%
            </span>
          </div>
          <Slider
            id="blend-opacity"
            min={0}
            max={1}
            step={0.01}
            value={[blendOpacity]}
            onValueChange={values => onBlendOpacityChange(values[0])}
          />
        </div>

        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
          <p>Layer blending enables visual comparison between different data variables to discover relationships and patterns.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerBlendingControls;
