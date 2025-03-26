
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface MobileFilterProps {
  categories: FilterOption[];
  formats: FilterOption[];
  regions: FilterOption[];
  selectedCategory: string;
  selectedFormat: string;
  selectedRegion: string;
  onCategoryChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const MobileFilter = ({
  categories,
  formats,
  regions,
  selectedCategory,
  selectedFormat,
  selectedRegion,
  onCategoryChange,
  onFormatChange,
  onRegionChange,
  onClearFilters,
  onApplyFilters
}: MobileFilterProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="md:hidden border-t border-border/50 p-4">
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center cursor-pointer"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <Filter className="mr-2 h-4 w-4" />
        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
      
      {showMobileFilters && (
        <div className="mt-4 space-y-4 animate-slide-down">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 rounded-md border border-border bg-background cursor-pointer"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Format Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              className="w-full p-2 rounded-md border border-border bg-background cursor-pointer"
              value={selectedFormat}
              onChange={(e) => onFormatChange(e.target.value)}
            >
              <option value="">All Formats</option>
              {formats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Region</label>
            <select
              className="w-full p-2 rounded-md border border-border bg-background cursor-pointer"
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="flex-1 cursor-pointer"
            >
              Clear All
            </Button>
            
            <Button 
              size="sm" 
              onClick={onApplyFilters}
              className="flex-1 cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFilter;
