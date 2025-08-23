
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface DropdownFilterProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const DropdownFilter = ({
  title,
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle
}: DropdownFilterProps) => {
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-sm cursor-pointer hover:text-primary transition-colors"
        onClick={onToggle}
      >
        <span className={selectedValue ? 'font-medium text-primary' : 'text-foreground/70'}>
          {selectedValue || title}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-lg shadow-lg z-50 animate-scale-in">
          <div className="p-2 max-h-60 overflow-y-auto">
            <button
              className={`w-full text-left px-3 py-1.5 text-sm rounded-md cursor-pointer ${
                !selectedValue 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-secondary'
              }`}
              onClick={() => {
                onSelect('');
                onToggle();
              }}
            >
              All {title}s
            </button>
            
            {options.map(option => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center cursor-pointer ${
                  selectedValue === option.value 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => {
                  onSelect(option.value);
                  onToggle();
                }}
              >
                <span>{option.label}</span>
                {option.count && (
                  <span className="text-xs text-foreground/50">{option.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
