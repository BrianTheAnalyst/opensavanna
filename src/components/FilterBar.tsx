
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Filter, X, ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterBarProps {
  categories: FilterOption[];
  formats: FilterOption[];
  regions: FilterOption[];
  onFilterChange: (filters: any) => void;
}

const FilterBar = ({ 
  categories = [], 
  formats = [], 
  regions = [], 
  onFilterChange 
}: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [dropdownStates, setDropdownStates] = useState({
    category: false,
    format: false,
    region: false
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const toggleDropdown = (dropdown: 'category' | 'format' | 'region') => {
    // Close all other dropdowns when opening a new one
    setDropdownStates({
      category: dropdown === 'category' ? !dropdownStates[dropdown] : false,
      format: dropdown === 'format' ? !dropdownStates[dropdown] : false,
      region: dropdown === 'region' ? !dropdownStates[dropdown] : false
    });
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedFormat('');
    setSelectedRegion('');
    onFilterChange({});
  };
  
  const applyFilters = () => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      format: selectedFormat,
      region: selectedRegion
    };
    
    onFilterChange(filters);
  };
  
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden mb-8">
      <div className="p-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search datasets by keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center justify-between border-t border-border/50 p-4">
        <div className="flex items-center space-x-4">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => toggleDropdown('category')}
            >
              <span className={selectedCategory ? 'font-medium text-primary' : 'text-foreground/70'}>
                {selectedCategory || 'Category'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {dropdownStates.category && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-lg shadow-lg z-50 animate-scale-in">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md cursor-pointer ${
                      !selectedCategory 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => {
                      setSelectedCategory('');
                      toggleDropdown('category');
                    }}
                  >
                    All Categories
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category.value}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center cursor-pointer ${
                        selectedCategory === category.value 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        toggleDropdown('category');
                      }}
                    >
                      <span>{category.label}</span>
                      {category.count && (
                        <span className="text-xs text-foreground/50">{category.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Format Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => toggleDropdown('format')}
            >
              <span className={selectedFormat ? 'font-medium text-primary' : 'text-foreground/70'}>
                {selectedFormat || 'Format'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {dropdownStates.format && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-lg shadow-lg z-50 animate-scale-in">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md cursor-pointer ${
                      !selectedFormat 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => {
                      setSelectedFormat('');
                      toggleDropdown('format');
                    }}
                  >
                    All Formats
                  </button>
                  
                  {formats.map(format => (
                    <button
                      key={format.value}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center cursor-pointer ${
                        selectedFormat === format.value 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => {
                        setSelectedFormat(format.value);
                        toggleDropdown('format');
                      }}
                    >
                      <span>{format.label}</span>
                      {format.count && (
                        <span className="text-xs text-foreground/50">{format.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Region Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => toggleDropdown('region')}
            >
              <span className={selectedRegion ? 'font-medium text-primary' : 'text-foreground/70'}>
                {selectedRegion || 'Region'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {dropdownStates.region && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-lg shadow-lg z-50 animate-scale-in">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md cursor-pointer ${
                      !selectedRegion 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => {
                      setSelectedRegion('');
                      toggleDropdown('region');
                    }}
                  >
                    All Regions
                  </button>
                  
                  {regions.map(region => (
                    <button
                      key={region.value}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center cursor-pointer ${
                        selectedRegion === region.value 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => {
                        setSelectedRegion(region.value);
                        toggleDropdown('region');
                      }}
                    >
                      <span>{region.label}</span>
                      {region.count && (
                        <span className="text-xs text-foreground/50">{region.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {(selectedCategory || selectedFormat || selectedRegion) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-xs cursor-pointer"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
          
          <Button 
            size="sm" 
            onClick={applyFilters}
            className="text-xs cursor-pointer"
          >
            Apply Filters
          </Button>
        </div>
      </div>
      
      {/* Mobile Filters Button */}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                onChange={(e) => setSelectedFormat(e.target.value)}
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
                onChange={(e) => setSelectedRegion(e.target.value)}
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
                onClick={handleClearFilters}
                className="flex-1 cursor-pointer"
              >
                Clear All
              </Button>
              
              <Button 
                size="sm" 
                onClick={applyFilters}
                className="flex-1 cursor-pointer"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
