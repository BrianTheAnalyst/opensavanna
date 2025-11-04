// ECharts theme that integrates with our design system
export const createEChartsTheme = () => {
  // Get CSS variables from the design system
  const getColor = (varName: string) => {
    if (typeof window === 'undefined') return '#000';
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(varName).trim();
    // Convert HSL to hex for ECharts
    if (value.includes(' ')) {
      const [h, s, l] = value.split(' ').map(v => parseFloat(v.replace('%', '')));
      return hslToHex(h, s, l);
    }
    return value;
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  return {
    color: [
      getColor('--chart-1'),
      getColor('--chart-2'),
      getColor('--chart-3'),
      getColor('--chart-4'),
      getColor('--chart-5'),
      getColor('--primary'),
      getColor('--secondary'),
      getColor('--accent'),
    ],
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: 'inherit',
      color: getColor('--foreground'),
    },
    title: {
      textStyle: {
        color: getColor('--foreground'),
        fontWeight: 600,
      },
      subtextStyle: {
        color: getColor('--muted-foreground'),
      },
    },
    line: {
      itemStyle: {
        borderWidth: 2,
      },
      lineStyle: {
        width: 3,
      },
      symbolSize: 8,
      symbol: 'circle',
      smooth: true,
    },
    radar: {
      itemStyle: {
        borderWidth: 2,
      },
      lineStyle: {
        width: 3,
      },
      symbolSize: 8,
      symbol: 'circle',
      smooth: true,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderRadius: [4, 4, 0, 0],
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 2,
        borderColor: getColor('--background'),
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 1,
        borderColor: getColor('--background'),
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 2,
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 1,
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
      },
    },
    candlestick: {
      itemStyle: {
        color: '#4ade80',
        color0: '#f87171',
        borderColor: '#22c55e',
        borderColor0: '#ef4444',
        borderWidth: 2,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
      },
      lineStyle: {
        width: 2,
        color: getColor('--muted-foreground'),
      },
      symbolSize: 8,
      symbol: 'circle',
      smooth: true,
      label: {
        color: getColor('--foreground'),
      },
    },
    map: {
      itemStyle: {
        areaColor: getColor('--muted'),
        borderColor: getColor('--border'),
        borderWidth: 1,
      },
      label: {
        color: getColor('--foreground'),
      },
      emphasis: {
        itemStyle: {
          areaColor: getColor('--primary'),
          borderColor: getColor('--primary'),
          borderWidth: 2,
        },
        label: {
          color: getColor('--primary-foreground'),
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: getColor('--muted'),
        borderColor: getColor('--border'),
        borderWidth: 1,
      },
      label: {
        color: getColor('--foreground'),
      },
      emphasis: {
        itemStyle: {
          areaColor: getColor('--primary'),
          borderColor: getColor('--primary'),
        },
        label: {
          color: getColor('--primary-foreground'),
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: getColor('--border'),
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: getColor('--muted-foreground'),
        fontSize: 11,
      },
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
    },
    valueAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: getColor('--muted-foreground'),
        fontSize: 11,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: getColor('--border'),
          opacity: 0.3,
        },
      },
      splitArea: {
        show: false,
      },
    },
    logAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: getColor('--muted-foreground'),
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: getColor('--border'),
        },
      },
      splitArea: {
        show: false,
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: getColor('--border'),
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: getColor('--muted-foreground'),
      },
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: getColor('--muted-foreground'),
      },
      emphasis: {
        iconStyle: {
          borderColor: getColor('--foreground'),
        },
      },
    },
    legend: {
      textStyle: {
        color: getColor('--foreground'),
      },
    },
    tooltip: {
      backgroundColor: getColor('--card'),
      borderColor: getColor('--border'),
      borderWidth: 1,
      textStyle: {
        color: getColor('--card-foreground'),
      },
    },
    timeline: {
      lineStyle: {
        color: getColor('--border'),
        width: 2,
      },
      itemStyle: {
        color: getColor('--primary'),
        borderWidth: 1,
      },
      controlStyle: {
        color: getColor('--primary'),
        borderColor: getColor('--primary'),
        borderWidth: 1,
      },
      checkpointStyle: {
        color: getColor('--primary'),
        borderColor: getColor('--primary'),
      },
      label: {
        color: getColor('--foreground'),
      },
      emphasis: {
        itemStyle: {
          color: getColor('--primary'),
        },
        controlStyle: {
          color: getColor('--primary'),
          borderColor: getColor('--primary'),
          borderWidth: 2,
        },
        label: {
          color: getColor('--foreground'),
        },
      },
    },
    visualMap: {
      textStyle: {
        color: getColor('--foreground'),
      },
    },
    dataZoom: {
      handleSize: 'undefined%',
      textStyle: {
        color: getColor('--foreground'),
      },
    },
    markPoint: {
      label: {
        color: getColor('--primary-foreground'),
      },
      emphasis: {
        label: {
          color: getColor('--primary-foreground'),
        },
      },
    },
  };
};
