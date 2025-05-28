
import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Area, AreaChart
} from 'recharts';

interface ChartContentProps {
  data: any[];
  colors: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: any, name: any) => React.ReactNode;
}

export const BarChartContent: React.FC<ChartContentProps> = ({ 
  data, 
  colors,
  xAxisLabel = 'Categories',
  yAxisLabel = 'Value',
  tooltipFormatter
}) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" opacity={0.6} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          label={{ 
            value: xAxisLabel, 
            position: 'insideBottom', 
            offset: -5,
            style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' }
          }}
          height={60}
          tickMargin={8}
          angle={-30}
          textAnchor="end"
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          label={{ 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' }
          }}
          width={60}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }}
          formatter={tooltipFormatter}
        />
        <Legend 
          verticalAlign="top"
          wrapperStyle={{ paddingBottom: '10px' }}
        />
        <Bar 
          dataKey="value" 
          name="Value"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
              fillOpacity={0.85}
              stroke={colors[index % colors.length]}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const LineChartContent: React.FC<ChartContentProps> = ({ 
  data, 
  colors,
  xAxisLabel = 'Time Period',
  yAxisLabel = 'Value',
  tooltipFormatter
}) => {
  // Check if data has projected values
  const hasProjections = data.some(item => item.projected);
  
  // Find min, max and avg values for reference lines
  const values = data.map(item => item.value);
  const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" opacity={0.6} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            label={{ 
              value: xAxisLabel, 
              position: 'insideBottom', 
              offset: -5,
              style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' }
            }}
            height={60}
            tickMargin={8}
            angle={-30}
            textAnchor="end"
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' }
            }}
            width={60}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
            formatter={tooltipFormatter}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend />
          
          {/* Reference lines for statistics */}
          <ReferenceLine y={avgValue} stroke="#888" strokeDasharray="3 3" label={{ 
            value: "Average", 
            position: 'right',
            fill: '#888',
            fontSize: 11
          }} />
          
          <Line 
            type="monotone" 
            dataKey="value" 
            name={yAxisLabel}
            stroke={colors[1]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 1 }}
            animationDuration={1000}
          />
          
          {hasProjections && (
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Projected"
              stroke={colors[2]}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChartContent: React.FC<ChartContentProps> = ({ 
  data, 
  colors,
  tooltipFormatter
}) => (
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
          label={({ name, percent }) => 
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          animationDuration={1000}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke="#fff" 
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }}
          formatter={tooltipFormatter}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ paddingTop: '15px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const AreaChartContent: React.FC<ChartContentProps> = ({ 
  data, 
  colors,
  xAxisLabel = 'Time Period',
  yAxisLabel = 'Value',
  tooltipFormatter
}) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" opacity={0.6} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          label={{ 
            value: xAxisLabel, 
            position: 'insideBottom', 
            offset: -5,
            style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' }
          }}
          height={60}
          tickMargin={8}
          angle={-30}
          textAnchor="end"
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          label={{ 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' }
          }}
          width={60}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }}
          formatter={tooltipFormatter}
        />
        <Legend />
        
        <Area 
          type="monotone" 
          dataKey="value" 
          name={yAxisLabel}
          stroke={colors[0]}
          fill={colors[0]}
          fillOpacity={0.3}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
