import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { useDashboardFilters, DashboardFilter } from '@/contexts/DashboardFilterContext';
import { motion, AnimatePresence } from 'framer-motion';

export const FilterPills = () => {
  const { filters, removeFilter, clearFilters } = useDashboardFilters();

  if (filters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg border border-border"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Active Filters:</span>
      </div>

      <AnimatePresence mode="popLayout">
        {filters.map((filter) => (
          <motion.div
            key={filter.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-2">
              <span className="text-xs">{filter.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={clearFilters}
        >
          Clear All
        </Button>
      )}
    </motion.div>
  );
};
