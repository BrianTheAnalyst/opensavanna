
import { Layers, MoveHorizontal } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

interface LayerBlendingControlsProps {
  primaryLayer: string;
  secondaryLayer: string;
  blendMode: string;
  blendOpacity: number;
  availableLayers: Array<{ id: string; name: string; category?: string }>;
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
  // Group layers by category
  const layersByCategory = availableLayers.reduce<Record<string, typeof availableLayers>>((acc, layer) => {
    const category = layer.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(layer);
    return acc;
  }, {});

  const categories = Object.keys(layersByCategory);

  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Layers className="h-4 w-4 mr-2 text-primary" />
          Layer Blending
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primary-layer" className="text-sm">Primary Layer</Label>
          <Select value={primaryLayer} onValueChange={onPrimaryLayerChange}>
            <SelectTrigger id="primary-layer" className="w-full">
              <SelectValue placeholder="Select a layer" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <React.Fragment key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </div>
                  {layersByCategory[category].map(layer => (
                    <SelectItem key={layer.id} value={layer.id}>
                      {layer.name}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center">
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-primary/5">
            <MoveHorizontal className="h-3 w-3 text-primary" />
            <span className="text-xs">{blendMode}</span>
          </Badge>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary-layer" className="text-sm">Secondary Layer</Label>
          <Select value={secondaryLayer} onValueChange={onSecondaryLayerChange}>
            <SelectTrigger id="secondary-layer" className="w-full">
              <SelectValue placeholder="Select a layer" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <React.Fragment key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </div>
                  {layersByCategory[category].map(layer => (
                    <SelectItem key={layer.id} value={layer.id}>
                      {layer.name}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blend-mode" className="text-sm">Blend Mode</Label>
          <Select value={blendMode} onValueChange={onBlendModeChange}>
            <SelectTrigger id="blend-mode" className="w-full">
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
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              {Math.round(blendOpacity * 100)}%
            </span>
          </div>
          <Slider
            id="blend-opacity"
            min={0}
            max={1}
            step={0.01}
            value={[blendOpacity]}
            onValueChange={values => { onBlendOpacityChange(values[0]); }}
            className="cursor-pointer"
          />
        </div>

        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md border border-border/40">
          <p>Layer blending enables visual comparison between different data variables to discover relationships and patterns.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerBlendingControls;
