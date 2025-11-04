import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface DashboardFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'between' | 'in' | 'greaterThan' | 'lessThan';
  value: any;
  chartId?: string; // Which chart triggered this filter
  label: string;
}

interface DashboardFilterContextType {
  filters: DashboardFilter[];
  addFilter: (filter: DashboardFilter) => void;
  removeFilter: (filterId: string) => void;
  clearFilters: () => void;
  clearChartFilters: (chartId: string) => void;
  applyFiltersToData: (data: any[], chartId?: string) => any[];
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export const DashboardFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<DashboardFilter[]>([]);

  const addFilter = useCallback((filter: DashboardFilter) => {
    setFilters(prev => {
      // Remove existing filters from the same chart and field
      const filtered = prev.filter(f => 
        !(f.chartId === filter.chartId && f.field === filter.field)
      );
      return [...filtered, filter];
    });
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const clearChartFilters = useCallback((chartId: string) => {
    setFilters(prev => prev.filter(f => f.chartId !== chartId));
  }, []);

  const applyFiltersToData = useCallback((data: any[], chartId?: string) => {
    // Don't apply filters created by the same chart
    const applicableFilters = filters.filter(f => f.chartId !== chartId);
    
    if (applicableFilters.length === 0) return data;

    return data.filter(item => {
      return applicableFilters.every(filter => {
        const itemValue = item[filter.field];
        
        switch (filter.operator) {
          case 'equals':
            return itemValue === filter.value;
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(itemValue);
          case 'greaterThan':
            return Number(itemValue) > Number(filter.value);
          case 'lessThan':
            return Number(itemValue) < Number(filter.value);
          case 'between':
            return Array.isArray(filter.value) && 
              Number(itemValue) >= Number(filter.value[0]) && 
              Number(itemValue) <= Number(filter.value[1]);
          default:
            return true;
        }
      });
    });
  }, [filters]);

  return (
    <DashboardFilterContext.Provider
      value={{
        filters,
        addFilter,
        removeFilter,
        clearFilters,
        clearChartFilters,
        applyFiltersToData,
      }}
    >
      {children}
    </DashboardFilterContext.Provider>
  );
};

export const useDashboardFilters = () => {
  const context = useContext(DashboardFilterContext);
  if (!context) {
    throw new Error('useDashboardFilters must be used within DashboardFilterProvider');
  }
  return context;
};
