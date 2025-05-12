
import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
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
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
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

export const LineChartContent: React.FC<ChartContentProps> = ({ data, colors }) => (
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
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }} 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={colors[1]}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

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
