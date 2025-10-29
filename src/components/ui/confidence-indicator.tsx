/**
 * Confidence Indicator Component - Immediate Fix #2
 * Shows users the reliability of insights and data sources
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  confidence: number; // 0-100
  dataSource: 'real' | 'empty';
  className?: string;
  showDetails?: boolean;
  issues?: string[];
  recommendations?: string[];
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  dataSource,
  className,
  showDetails = false,
  issues = [],
  recommendations = []
}) => {
  const getIndicatorConfig = () => {
    if (dataSource === 'empty') {
      return {
        color: 'destructive',
        icon: AlertCircle,
        label: 'No Data',
        description: 'No data available for analysis'
      };
    }

    if (confidence >= 80) {
      return {
        color: 'default',
        icon: CheckCircle,
        label: 'High Confidence',
        description: 'Based on complete, high-quality data'
      };
    }

    if (confidence >= 50) {
      return {
        color: 'secondary',
        icon: AlertTriangle,
        label: 'Medium Confidence',
        description: 'Some data quality issues detected'
      };
    }

    return {
      color: 'destructive',
      icon: AlertCircle,
      label: 'Low Confidence',
      description: 'Significant data quality concerns'
    };
  };

  const config = getIndicatorConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Badge variant={config.color as any} className="flex items-center gap-1">
          <IconComponent className="h-3 w-3" />
          {config.label}
          {dataSource === 'real' && ` ${confidence}%`}
        </Badge>
      </div>

      {showDetails && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{config.description}</p>
          
          {issues.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-destructive">Issues:</p>
              {issues.map((issue, index) => (
                <p key={index} className="text-destructive">• {issue}</p>
              ))}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-primary">Suggestions:</p>
              {recommendations.map((rec, index) => (
                <p key={index} className="text-primary">• {rec}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfidenceIndicator;