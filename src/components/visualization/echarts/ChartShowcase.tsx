import React from 'react';
import { EChartsRenderer, ChartType } from './EChartsRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data for showcasing different chart types
const sampleBarData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 200 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 280 },
  { name: 'May', value: 210 },
  { name: 'Jun', value: 300 },
];

const sampleLineData = [
  { name: 'Week 1', value: 1200 },
  { name: 'Week 2', value: 1900 },
  { name: 'Week 3', value: 1500 },
  { name: 'Week 4', value: 2100 },
  { name: 'Week 5', value: 2400 },
];

const samplePieData = [
  { name: 'Category A', value: 335 },
  { name: 'Category B', value: 310 },
  { name: 'Category C', value: 234 },
  { name: 'Category D', value: 135 },
  { name: 'Category E', value: 148 },
];

const sampleScatterData = [
  { x: 10, y: 20, name: 'Point 1' },
  { x: 30, y: 50, name: 'Point 2' },
  { x: 50, y: 30, name: 'Point 3' },
  { x: 70, y: 80, name: 'Point 4' },
  { x: 90, y: 60, name: 'Point 5' },
];

const sampleRadarData = [
  { name: 'Product A', speed: 85, power: 75, durability: 90, safety: 80, comfort: 70 },
  { name: 'Product B', speed: 70, power: 85, durability: 80, safety: 90, comfort: 85 },
];

const sampleFunnelData = [
  { name: 'Visits', value: 1000 },
  { name: 'Sign Ups', value: 600 },
  { name: 'Active Users', value: 350 },
  { name: 'Purchases', value: 150 },
  { name: 'Returns', value: 80 },
];

interface ChartShowcaseProps {
  type?: ChartType;
}

export const ChartShowcase: React.FC<ChartShowcaseProps> = ({ type }) => {
  if (type) {
    // Show single chart type
    return (
      <div className="p-4">
        {renderChart(type)}
      </div>
    );
  }

  // Show all chart types
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {renderChart('bar')}
      {renderChart('line')}
      {renderChart('pie')}
      {renderChart('scatter')}
      {renderChart('area')}
      {renderChart('radar')}
      {renderChart('funnel')}
      {renderChart('gauge')}
    </div>
  );
};

const renderChart = (type: ChartType) => {
  const getData = () => {
    switch (type) {
      case 'bar': return sampleBarData;
      case 'line':
      case 'area': return sampleLineData;
      case 'pie': return samplePieData;
      case 'scatter': return sampleScatterData;
      case 'radar': return sampleRadarData;
      case 'funnel': return sampleFunnelData;
      case 'gauge': return sampleBarData;
      default: return sampleBarData;
    }
  };

  const getTitle = () => {
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Chart';
  };

  const getDescription = () => {
    const descriptions: Record<ChartType, string> = {
      bar: 'Compare values across categories',
      line: 'Show trends over time',
      pie: 'Display proportions and percentages',
      scatter: 'Show relationships between variables',
      area: 'Emphasize magnitude of change over time',
      radar: 'Compare multiple variables',
      funnel: 'Show progressive reduction in stages',
      gauge: 'Display single value as a gauge',
      heatmap: 'Show data density and patterns',
      treemap: 'Display hierarchical data',
      sankey: 'Show flow between nodes',
      boxplot: 'Display statistical distributions',
    };
    return descriptions[type];
  };

  return (
    <Card key={type}>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <EChartsRenderer
          type={type}
          data={getData()}
          config={{
            showLegend: true,
            showGrid: type !== 'pie' && type !== 'radar' && type !== 'gauge',
            smooth: type === 'line' || type === 'area',
          }}
          height="300px"
          enableCrossFilter={false}
        />
      </CardContent>
    </Card>
  );
};

export default ChartShowcase;
