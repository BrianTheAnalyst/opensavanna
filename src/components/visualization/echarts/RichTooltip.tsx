import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Maximize2, Filter, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface TooltipData {
  name: string;
  value: number;
  change?: number;
  trend?: number[];
  additionalData?: Record<string, any>;
  category?: string;
}

interface RichTooltipContentProps {
  data: TooltipData;
  onDrillDown?: () => void;
  onFilter?: () => void;
  showActions?: boolean;
}

export const RichTooltipContent: React.FC<RichTooltipContentProps> = ({
  data,
  onDrillDown,
  onFilter,
  showActions = true,
}) => {
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toLocaleString();
  };

  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="min-w-[200px] max-w-[300px]">
      {/* Header */}
      <div className="space-y-1">
        <div className="font-semibold text-sm">{data.name}</div>
        {data.category && (
          <div className="text-xs text-muted-foreground">{data.category}</div>
        )}
      </div>

      <Separator className="my-2" />

      {/* Main Value */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Value</span>
          <span className="text-xl font-bold">{formatValue(data.value)}</span>
        </div>

        {/* Change Indicator */}
        {data.change !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Change</span>
            <div className="flex items-center gap-1">
              {data.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  data.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatChange(data.change)}
              </span>
            </div>
          </div>
        )}

        {/* Mini Trend Chart */}
        {data.trend && data.trend.length > 0 && (
          <div className="pt-2">
            <div className="h-8 flex items-end gap-0.5">
              {data.trend.map((val, idx) => {
                const maxVal = Math.max(...data.trend!);
                const height = (val / maxVal) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-primary/60 rounded-sm transition-all hover:bg-primary"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              Recent Trend
            </div>
          </div>
        )}

        {/* Additional Data */}
        {data.additionalData && Object.keys(data.additionalData).length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="space-y-1">
              {Object.entries(data.additionalData).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (onDrillDown || onFilter) && (
        <>
          <Separator className="my-2" />
          <div className="flex gap-1">
            {onDrillDown && (
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDrillDown();
                }}
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Drill Down
              </Button>
            )}
            {onFilter && (
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilter();
                }}
              >
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Helper to create tooltip HTML for ECharts
export const createTooltipHTML = (data: TooltipData): string => {
  const formatValue = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toLocaleString();
  };

  let html = `
    <div style="min-width: 200px; padding: 8px;">
      <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${data.name}</div>
      ${data.category ? `<div style="font-size: 11px; color: #888; margin-bottom: 8px;">${data.category}</div>` : ''}
      
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
        <span style="font-size: 11px; color: #888;">Value</span>
        <span style="font-size: 18px; font-weight: bold;">${formatValue(data.value)}</span>
      </div>
  `;

  if (data.change !== undefined) {
    const changeColor = data.change > 0 ? '#22c55e' : '#ef4444';
    const changeSymbol = data.change > 0 ? '▲' : '▼';
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: #888;">Change</span>
        <span style="font-size: 13px; font-weight: 600; color: ${changeColor};">
          ${changeSymbol} ${Math.abs(data.change).toFixed(1)}%
        </span>
      </div>
    `;
  }

  if (data.additionalData) {
    html += '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">';
    Object.entries(data.additionalData).forEach(([key, value]) => {
      html += `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
          <span style="color: #888;">${key.replace(/_/g, ' ')}</span>
          <span style="font-weight: 500;">${value}</span>
        </div>
      `;
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
};
