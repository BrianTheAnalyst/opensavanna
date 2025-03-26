
import { useState } from 'react';
import SearchInput from './filter/SearchInput';
import DesktopFilter from './filter/DesktopFilter';
import MobileFilter from './filter/MobileFilter';

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
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm}
          onSubmit={handleSearch}
        />
      </div>
      
      {/* Desktop Filters */}
      <DesktopFilter 
        categories={categories}
        formats={formats}
        regions={regions}
        selectedCategory={selectedCategory}
        selectedFormat={selectedFormat}
        selectedRegion={selectedRegion}
        dropdownStates={dropdownStates}
        onCategoryChange={setSelectedCategory}
        onFormatChange={setSelectedFormat}
        onRegionChange={setSelectedRegion}
        onToggleDropdown={toggleDropdown}
        onClearFilters={handleClearFilters}
        onApplyFilters={applyFilters}
      />
      
      {/* Mobile Filters */}
      <MobileFilter 
        categories={categories}
        formats={formats}
        regions={regions}
        selectedCategory={selectedCategory}
        selectedFormat={selectedFormat}
        selectedRegion={selectedRegion}
        onCategoryChange={setSelectedCategory}
        onFormatChange={setSelectedFormat}
        onRegionChange={setSelectedRegion}
        onClearFilters={handleClearFilters}
        onApplyFilters={applyFilters}
      />
    </div>
  );
};

export default FilterBar;
