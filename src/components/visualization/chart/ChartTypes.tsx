
import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ChartContentProps {
  data: any[];
  colors: string[];
}

export const BarChartContent: React.FC<ChartContentProps> = ({ data, colors }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          label={{ value: 'Categories', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }} 
        />
        <Legend />
        <Bar 
          dataKey="value" 
          fill={colors[0]}
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const LineChartContent: React.FC<ChartContentProps> = ({ data, colors }) => {
  // Find min and max for reference lines
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }} 
            formatter={(value, name) => [`${value}`, 'Value']}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend />
          <ReferenceLine y={avgValue} stroke="#888" strokeDasharray="3 3" label="Average" />
          <ReferenceLine y={maxValue} stroke="#82ca9d" strokeDasharray="3 3" label="Maximum" />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={colors[1]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 1 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChartContent: React.FC<ChartContentProps> = ({ data, colors }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }} 
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
