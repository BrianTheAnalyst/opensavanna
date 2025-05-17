
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Map, Filter } from 'lucide-react';

interface SpatialFilterPanelProps {
  onFilterChange: (filters: SpatialFilter) => void;
  regions: { id: string; name: string }[];
  isFiltering?: boolean;
}

export interface SpatialFilter {
  region: string | null;
  radius: number;
  includeOutliers: boolean;
}

const SpatialFilterPanel: React.FC<SpatialFilterPanelProps> = ({
  onFilterChange,
  regions = [],
  isFiltering = false
}) => {
  const [region, setRegion] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(50);
  const [includeOutliers, setIncludeOutliers] = useState<boolean>(false);
  
  const handleApplyFilter = () => {
    onFilterChange({
      region,
      radius,
      includeOutliers
    });
  };
  
  const handleResetFilter = () => {
    setRegion(null);
    setRadius(50);
    setIncludeOutliers(false);
    onFilterChange({
      region: null,
      radius: 0,
      includeOutliers: false
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Spatial Filtering
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm">Region</Label>
          <Select value={region || ''} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="radius" className="text-sm">Filter Radius (km)</Label>
            <span className="text-xs text-muted-foreground">{radius} km</span>
          </div>
          <Slider
            id="radius"
            min={0}
            max={500}
            step={5}
            value={[radius]}
            onValueChange={values => setRadius(values[0])}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="include-outliers"
            className="rounded border-gray-300"
            checked={includeOutliers}
            onChange={(e) => setIncludeOutliers(e.target.checked)}
          />
          <Label htmlFor="include-outliers" className="text-sm">Include outliers</Label>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            onClick={handleApplyFilter} 
            disabled={isFiltering || !region}
          >
            Apply Filter
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetFilter}
          >
            Reset
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
          <p>Spatial filtering allows you to focus on specific geographic areas and their surrounding regions.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpatialFilterPanel;
