
import React from 'react';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
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
}

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', 
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'
];

const InsightCard = ({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey = 'name',
  colors = COLORS,
  className,
  tooltipFormatter
}: InsightCardProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={tooltipFormatter}
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={tooltipFormatter}
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={tooltipFormatter}
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
