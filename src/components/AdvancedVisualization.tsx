
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Scatter, Cell, PieChart, Pie, Radar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Dataset } from '@/types/dataset';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedVisualizationProps {
  dataset: Dataset;
  data: any[];
}

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', 
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'
];

const AdvancedVisualization = ({ dataset, data }: AdvancedVisualizationProps) => {
  const [selectedTab, setSelectedTab] = useState('composed');
  const [dataKey, setDataKey] = useState('value');
  const [nameKey, setNameKey] = useState('name');
  
  // Available data keys from the first data item
  const getDataKeys = () => {
    if (data && data.length > 0) {
      return Object.keys(data[0]).filter(key => typeof data[0][key] === 'number');
    }
    return ['value'];
  };
  
  // Available name keys from the first data item
  const getNameKeys = () => {
    if (data && data.length > 0) {
      return Object.keys(data[0]).filter(key => typeof data[0][key] === 'string');
    }
    return ['name'];
  };
  
  // Determine if the data is suitable for time series visualization
  const isTimeSeriesData = () => {
    if (data && data.length > 0) {
      // Check if the first item has a date-like string property
      const firstItem = data[0];
      return Object.keys(firstItem).some(key => {
        const value = firstItem[key];
        return typeof value === 'string' && 
               (value.includes('Jan') || value.includes('Feb') || value.includes('Mar') || 
                value.includes('Apr') || value.includes('May') || value.includes('Jun') || 
                value.includes('Jul') || value.includes('Aug') || value.includes('Sep') || 
                value.includes('Oct') || value.includes('Nov') || value.includes('Dec'));
      });
    }
    return false;
  };

  const dataKeys = getDataKeys();
  const nameKeys = getNameKeys();

  // Update default keys based on data
  useEffect(() => {
    if (dataKeys.length > 0 && dataKeys[0] !== dataKey) {
      setDataKey(dataKeys[0]);
    }
    
    if (nameKeys.length > 0 && nameKeys[0] !== nameKey) {
      setNameKey(nameKeys[0]);
    }
    
    // Set default visualization type based on data
    if (isTimeSeriesData()) {
      setSelectedTab('line');
    } else if (data && data.length <= 5) {
      setSelectedTab('pie');
    } else {
      setSelectedTab('composed');
    }
  }, [data]);
  
  if (!data || data.length === 0) {
    return (
      <div className="glass border border-border/50 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-3">Advanced Visualization</h3>
        <p className="text-foreground/70">No data available for visualization</p>
      </div>
    );
  }

  return (
    <div className="glass border border-border/50 rounded-xl p-6">
      <h3 className="text-lg font-medium mb-3">Advanced Visualization</h3>
      <p className="text-foreground/70 mb-4">
        Interactive data visualization with multiple view options
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <p className="text-sm font-medium mb-2">Select Visualization Type</p>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="glass grid grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="composed">Combined</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="pie">Pie</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Data Field</p>
            <Select value={dataKey} onValueChange={setDataKey}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select value field" />
              </SelectTrigger>
              <SelectContent>
                {dataKeys.map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Label Field</p>
            <Select value={nameKey} onValueChange={setNameKey}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select name field" />
              </SelectTrigger>
              <SelectContent>
                {nameKeys.map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="h-96 mb-4">
        <TabsContent value="composed" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis 
                dataKey={nameKey} 
                scale="band" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
              <Bar dataKey={dataKey} barSize={20} fill="#6366f1" />
              <Line type="monotone" dataKey={dataKey} stroke="#8b5cf6" />
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="line" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
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
                dataKey={dataKey} 
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 5, strokeWidth: 1 }}
                activeDot={{ r: 7, strokeWidth: 1 }}
              />
              <Area 
                type="monotone"
                dataKey={dataKey}
                fill="#6366f130"
                stroke="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="bar" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="pie" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="radar" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={nameKey} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              <Radar 
                name={dataKey} 
                dataKey={dataKey} 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.5} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="area" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                fill="#6366f1" 
                stroke="#6366f1"
                fillOpacity={0.8}
              />
              <Scatter dataKey={dataKey} fill="#ec4899" />
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4">
        <p>This visualization is generated based on the data in {dataset.title}. Use the controls above to change the visualization type and data fields.</p>
      </div>
    </div>
  );
};

export default AdvancedVisualization;
