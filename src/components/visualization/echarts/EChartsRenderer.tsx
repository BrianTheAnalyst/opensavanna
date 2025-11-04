import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { createEChartsTheme } from '@/lib/echarts-theme';
import { useDashboardFilters, DashboardFilter } from '@/contexts/DashboardFilterContext';
import { createTooltipHTML, TooltipData } from './RichTooltip';
import { useToast } from '@/hooks/use-toast';

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'scatter' 
  | 'area'
  | 'radar'
  | 'funnel'
  | 'gauge'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'boxplot';

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  smooth?: boolean;
  stack?: boolean;
  toolbox?: boolean;
  zoom?: boolean;
  animation?: boolean;
}

interface EChartsRendererProps {
  type: ChartType;
  data: any[];
  config?: ChartConfig;
  chartId?: string;
  onDrillDown?: (params: any) => void;
  enableCrossFilter?: boolean;
  height?: string;
  nameKey?: string;
  dataKey?: string;
  className?: string;
}

export const EChartsRenderer: React.FC<EChartsRendererProps> = ({
  type,
  data,
  config = {},
  chartId = `chart-${Math.random().toString(36).substr(2, 9)}`,
  onDrillDown,
  enableCrossFilter = true,
  height = '400px',
  nameKey = 'name',
  dataKey = 'value',
  className = '',
}) => {
  const { addFilter, applyFiltersToData } = useDashboardFilters();
  const { toast } = useToast();
  const chartRef = useRef<ReactECharts>(null);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return applyFiltersToData(data, chartId);
  }, [data, applyFiltersToData, chartId]);

  // Register theme
  useEffect(() => {
    const theme = createEChartsTheme();
    echarts.registerTheme('custom-theme', theme);
  }, []);

  // Generate chart option based on type
  const option = useMemo(() => {
    const baseOption = {
      animation: config.animation !== false,
      animationDuration: 800,
      animationEasing: 'cubicOut',
      title: config.title ? {
        text: config.title,
        subtext: config.subtitle,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      } : undefined,
      legend: config.showLegend !== false ? {
        bottom: 10,
        left: 'center',
      } : undefined,
      grid: config.showGrid !== false ? {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: config.title ? '15%' : '5%',
        containLabel: true,
      } : undefined,
      toolbox: config.toolbox ? {
        feature: {
          saveAsImage: { title: 'Save' },
          dataZoom: { title: { zoom: 'Zoom', back: 'Reset' } },
          restore: { title: 'Restore' },
        },
        right: 20,
      } : undefined,
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis',
        confine: true,
        formatter: (params: any) => {
          const param = Array.isArray(params) ? params[0] : params;
          if (!param) return '';

          const tooltipData: TooltipData = {
            name: param.name || param.data[nameKey],
            value: param.value || param.data[dataKey],
            category: config.title,
          };

          return createTooltipHTML(tooltipData);
        },
      },
    };

    switch (type) {
      case 'bar':
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: filteredData.map(item => item[nameKey]),
            name: config.xAxisLabel,
            axisLabel: {
              rotate: filteredData.length > 8 ? 45 : 0,
              interval: 0,
            },
          },
          yAxis: {
            type: 'value',
            name: config.yAxisLabel,
          },
          series: [{
            type: 'bar',
            data: filteredData.map(item => item[dataKey]),
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)',
              },
            },
          }],
        };

      case 'line':
      case 'area':
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: filteredData.map(item => item[nameKey]),
            name: config.xAxisLabel,
            boundaryGap: false,
          },
          yAxis: {
            type: 'value',
            name: config.yAxisLabel,
          },
          series: [{
            type: 'line',
            data: filteredData.map(item => item[dataKey]),
            smooth: config.smooth !== false,
            areaStyle: type === 'area' ? { opacity: 0.7 } : undefined,
            emphasis: {
              focus: 'series',
            },
          }],
        };

      case 'pie':
        return {
          ...baseOption,
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              show: true,
              formatter: '{b}: {d}%',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            data: filteredData.map(item => ({
              name: item[nameKey],
              value: item[dataKey],
            })),
          }],
        };

      case 'scatter':
        return {
          ...baseOption,
          xAxis: {
            type: 'value',
            name: config.xAxisLabel,
          },
          yAxis: {
            type: 'value',
            name: config.yAxisLabel,
          },
          series: [{
            type: 'scatter',
            symbolSize: 12,
            data: filteredData.map(item => [
              item[nameKey] || item.x,
              item[dataKey] || item.y,
            ]),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)',
              },
            },
          }],
        };

      case 'radar':
        const indicators = Object.keys(filteredData[0] || {})
          .filter(key => key !== nameKey && typeof filteredData[0][key] === 'number')
          .map(key => ({ name: key, max: Math.max(...filteredData.map(d => d[key])) }));

        return {
          ...baseOption,
          radar: {
            indicator: indicators,
            shape: 'polygon',
            splitNumber: 5,
          },
          series: [{
            type: 'radar',
            data: filteredData.map(item => ({
              value: indicators.map(ind => item[ind.name]),
              name: item[nameKey],
            })),
            emphasis: {
              lineStyle: {
                width: 4,
              },
            },
          }],
        };

      case 'funnel':
        return {
          ...baseOption,
          series: [{
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: Math.max(...filteredData.map(item => item[dataKey])),
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
            },
            data: filteredData.map(item => ({
              name: item[nameKey],
              value: item[dataKey],
            })),
          }],
        };

      case 'gauge':
        const avgValue = filteredData.reduce((sum, item) => sum + item[dataKey], 0) / filteredData.length;
        return {
          ...baseOption,
          series: [{
            type: 'gauge',
            progress: {
              show: true,
              width: 18,
            },
            axisLine: {
              lineStyle: {
                width: 18,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
              },
            },
            axisLabel: {
              distance: 25,
              fontSize: 12,
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}',
              fontSize: 24,
            },
            data: [{
              value: avgValue,
              name: config.title || 'Average',
            }],
          }],
        };

      default:
        return baseOption;
    }
  }, [type, filteredData, config, nameKey, dataKey]);

  // Handle chart click for cross-filtering
  const handleChartClick = useCallback((params: any) => {
    if (enableCrossFilter && params.name) {
      const filter: DashboardFilter = {
        id: `${chartId}-${Date.now()}`,
        field: nameKey,
        operator: 'equals',
        value: params.name,
        chartId: chartId,
        label: `${config.title || 'Chart'}: ${params.name}`,
      };

      addFilter(filter);
      
      toast({
        title: 'Filter Applied',
        description: `Filtering by ${params.name}`,
      });
    }

    // Call drill-down handler if provided
    if (onDrillDown) {
      onDrillDown(params);
    }
  }, [enableCrossFilter, chartId, nameKey, config.title, addFilter, toast, onDrillDown]);

  const onEvents = {
    click: handleChartClick,
  };

  return (
    <div className={className}>
      <ReactECharts
        ref={chartRef}
        echarts={echarts}
        option={option}
        style={{ height, width: '100%' }}
        theme="custom-theme"
        onEvents={onEvents}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};
