
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import DropdownFilter from './DropdownFilter';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface DesktopFilterProps {
  categories: FilterOption[];
  formats: FilterOption[];
  regions: FilterOption[];
  selectedCategory: string;
  selectedFormat: string;
  selectedRegion: string;
  dropdownStates: {
    category: boolean;
    format: boolean;
    region: boolean;
  };
  onCategoryChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onToggleDropdown: (dropdown: 'category' | 'format' | 'region') => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const DesktopFilter = ({
  categories,
  formats,
  regions,
  selectedCategory,
  selectedFormat,
  selectedRegion,
  dropdownStates,
  onCategoryChange,
  onFormatChange,
  onRegionChange,
  onToggleDropdown,
  onClearFilters,
  onApplyFilters
}: DesktopFilterProps) => {
  const hasActiveFilters = selectedCategory || selectedFormat || selectedRegion;
  
  return (
    <div className="hidden md:flex items-center justify-between border-t border-border/50 p-4">
      <div className="flex items-center space-x-4">
        <DropdownFilter
          title="Category"
          options={categories}
          selectedValue={selectedCategory}
          onSelect={onCategoryChange}
          isOpen={dropdownStates.category}
          onToggle={() => onToggleDropdown('category')}
        />
        
        <DropdownFilter
          title="Format"
          options={formats}
          selectedValue={selectedFormat}
          onSelect={onFormatChange}
          isOpen={dropdownStates.format}
          onToggle={() => onToggleDropdown('format')}
        />
        
        <DropdownFilter
          title="Region"
          options={regions}
          selectedValue={selectedRegion}
          onSelect={onRegionChange}
          isOpen={dropdownStates.region}
          onToggle={() => onToggleDropdown('region')}
        />
      </div>
      
      <div className="flex items-center space-x-3">
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs cursor-pointer"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
        
        <Button 
          size="sm" 
          onClick={onApplyFilters}
          className="text-xs cursor-pointer"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default DesktopFilter;
