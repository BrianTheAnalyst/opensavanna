/**
 * Data Source Badge Component - Immediate Fix #3
 * Clear indicators for data authenticity
 */

import { Database, TestTube, AlertTriangle } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DataSourceBadgeProps {
  dataSource: 'real' | 'sample' | 'empty';
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
          text: 'Real Data',
          bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          textClass: 'text-green-800 dark:text-green-200'
        };
      case 'sample':
        return {
          variant: 'secondary' as const,
          icon: TestTube,
          text: 'Sample Data',
          bgClass: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
          textClass: 'text-orange-800 dark:text-orange-200'
        };
      case 'empty':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          text: 'No Data',
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

      {dataSource === 'sample' && (
        <span className="text-xs text-orange-600 dark:text-orange-400">
          Upload your dataset for real insights
        </span>
      )}
    </div>
  );
};

export default DataSourceBadge;