
import React from 'react';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine
} from 'recharts';

interface InsightCardProps {
  title: string;
  description?: string;
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar';
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  className?: string;
  tooltipFormatter?: (value: any, name: any) => React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const COLORS = [
  'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))',
  'hsl(var(--secondary))', 'hsl(var(--accent))'
];

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[120px]">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {formatter ? formatter(entry.value, entry.name) : 
                `${entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const InsightCard = ({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey = 'name',
  colors = COLORS,
  className,
  tooltipFormatter,
  xAxisLabel,
  yAxisLabel
}: InsightCardProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics for reference lines when using line charts
  const calculateStats = () => {
    if (type !== 'line' || !data.length) return {};
    
    const values = data.map(item => typeof item[dataKey] === 'number' ? item[dataKey] : 0);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length
    };
  };
  
  const stats = calculateStats();

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
              />
              <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
              <Legend wrapperStyle={{ paddingTop: '16px' }} />
              <Bar 
                dataKey={dataKey} 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
              />
              <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
              <Legend wrapperStyle={{ paddingTop: '16px' }} />
              {stats.avg !== undefined && (
                <ReferenceLine 
                  y={stats.avg} 
                  label={{ value: "Avg", position: "insideTopRight", fill: "hsl(var(--muted-foreground))" }} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5" 
                  opacity={0.7}
                />
              )}
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ r: 4, fill: colors[0], strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: '#fff' }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                animationDuration={600}
                stroke="#fff"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ paddingTop: '16px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="flex h-48 items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-b from-background/50 to-background rounded-lg p-4">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
