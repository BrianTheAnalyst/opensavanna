/**
 * Data Source Badge Component - Immediate Fix #3
 * Clear indicators for data authenticity
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, TestTube, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSourceBadgeProps {
  dataSource: 'real' | 'empty';
  recordCount?: number;
  lastUpdated?: string;
  className?: string;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  dataSource,
  recordCount,
  lastUpdated,
  className
}) => {
  const getBadgeConfig = () => {
    switch (dataSource) {
      case 'real':
        return {
          variant: 'default' as const,
          icon: Database,
          text: 'Real Data ✓',
          bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          textClass: 'text-green-800 dark:text-green-200'
        };
      case 'empty':
      default:
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          text: 'No Data Available ⚠️',
          bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          textClass: 'text-red-800 dark:text-red-200'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Badge 
        variant={config.variant}
        className={cn(
          'flex items-center gap-1 px-2 py-1',
          config.bgClass,
          config.textClass
        )}
      >
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
      
      {dataSource === 'real' && recordCount && (
        <span className="text-xs text-muted-foreground">
          {recordCount.toLocaleString()} records
          {lastUpdated && ` • Updated ${lastUpdated}`}
        </span>
      )}

      {dataSource === 'empty' && (
        <span className="text-xs text-red-600 dark:text-red-400">
          Upload a dataset file to enable visualizations
        </span>
      )}
    </div>
  );
};

export default DataSourceBadge;