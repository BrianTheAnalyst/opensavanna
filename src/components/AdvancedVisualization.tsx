
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Scatter, Cell, PieChart, Pie, Radar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Dataset } from '@/types/dataset';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface AdvancedVisualizationProps {
  dataset: Dataset;
  data: any[];
}

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', 
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'
];

// Number of items to show per page
const ITEMS_PER_PAGE = 15;

const AdvancedVisualization = ({ dataset, data }: AdvancedVisualizationProps) => {
  const [selectedTab, setSelectedTab] = useState('bar');
  const [dataKey, setDataKey] = useState('value');
  const [nameKey, setNameKey] = useState('name');
  const [isDataReady, setIsDataReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ensure we have valid data at initialization
  useEffect(() => {
    console.log("AdvancedVisualization received data:", data);
    
    try {
      // Validate and process input data
      if (data && Array.isArray(data) && data.length > 0) {
        // Ensure each data item has the required properties
        const validData = data.map(item => {
          if (typeof item !== 'object' || item === null) {
            return { name: 'Unknown', value: 0 };
          }
          
          // Ensure each item has name and value properties
          return {
            name: item.name || 'Unknown',
            value: typeof item.value === 'number' ? item.value : 0,
            ...item // Keep other properties
          };
        });
        
        console.log("Processed visualization data:", validData);
        setProcessedData(validData);
        setIsDataReady(true);
        
        // Determine best visualization type based on data
        if (validData.length <= 5) {
          setSelectedTab('pie');
        } else if (isTimeSeriesData(validData)) {
          setSelectedTab('line');
        } else {
          setSelectedTab('bar');
        }
        
        // Set appropriate keys
        const availableDataKeys = getDataKeys(validData);
        if (availableDataKeys.includes('value')) {
          setDataKey('value');
        } else if (availableDataKeys.length > 0) {
          setDataKey(availableDataKeys[0]);
        }
        
        const availableNameKeys = getNameKeys(validData);
        if (availableNameKeys.includes('name')) {
          setNameKey('name');
        } else if (availableNameKeys.length > 0) {
          setNameKey(availableNameKeys[0]);
        }
      } else {
        console.log("No valid data for visualization, using fallback data");
        setError("No valid data available for visualization");
        setProcessedData(getFallbackData());
        setIsDataReady(true);
      }
    } catch (err: any) {
      console.error("Error processing visualization data:", err);
      setError(err.message || "Failed to process visualization data");
      setProcessedData(getFallbackData());
      setIsDataReady(true);
    }
  }, [data]);
  
  // Available data keys from the first data item
  const getDataKeys = (dataArray: any[] = processedData) => {
    if (dataArray && dataArray.length > 0) {
      return Object.keys(dataArray[0]).filter(key => 
        typeof dataArray[0][key] === 'number' || 
        !isNaN(Number(dataArray[0][key]))
      );
    }
    return ['value'];
  };
  
  // Available name keys from the first data item
  const getNameKeys = (dataArray: any[] = processedData) => {
    if (dataArray && dataArray.length > 0) {
      return Object.keys(dataArray[0]).filter(key => 
        typeof dataArray[0][key] === 'string' && 
        key !== dataKey
      );
    }
    return ['name'];
  };
  
  // Determine if the data is suitable for time series visualization
  const isTimeSeriesData = (dataArray: any[] = processedData) => {
    if (dataArray && dataArray.length > 0) {
      // Check if the first item has a date-like string property
      const firstItem = dataArray[0];
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

  // Fallback data if no data is provided
  const getFallbackData = () => {
    return [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 200 },
      { name: 'Category D', value: 500 },
      { name: 'Category E', value: 350 }
    ];
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  
  // Get current items for pagination
  const getCurrentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    // Only apply pagination for bar, line, area and composed charts
    // For pie and radar, we'll use the entire dataset but limit the number of items
    if (['bar', 'line', 'area', 'composed'].includes(selectedTab)) {
      return processedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
    
    // For pie and radar, limit to a reasonable number
    if (['pie', 'radar'].includes(selectedTab)) {
      // Show at most 10 items for pie/radar charts to avoid visual clutter
      return processedData.slice(0, 10); 
    }
    
    return processedData;
  }, [processedData, currentPage, selectedTab]);
  
  // Reset to page 1 when changing visualization type
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  // Log the current state for debugging
  console.log("Current visualization state:", { 
    selectedTab, 
    dataKey, 
    nameKey, 
    isDataReady, 
    currentPage,
    totalItems: processedData.length,
    currentItems: getCurrentItems.length
  });

  // Render the appropriate chart based on selected tab
  const renderChart = () => {
    if (!isDataReady || getCurrentItems.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No data available for visualization</p>
        </div>
      );
    }

    switch (selectedTab) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getCurrentItems}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
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
                {getCurrentItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getCurrentItems}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
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
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getCurrentItems}
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
                {getCurrentItems.map((entry, index) => (
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
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getCurrentItems}>
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
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getCurrentItems}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
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
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getCurrentItems}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis 
                dataKey={nameKey} 
                scale="band" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
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
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Select a visualization type</p>
          </div>
        );
    }
  };

  if (!isDataReady) {
    return (
      <div className="glass border border-border/50 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-3">Advanced Visualization</h3>
        <p className="text-foreground/70 mb-4">Loading visualization options...</p>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-primary">
            Preparing visualization data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-border/50 rounded-xl p-6">
      <h3 className="text-lg font-medium mb-3">Advanced Visualization</h3>
      <p className="text-foreground/70 mb-4">
        Interactive data visualization with multiple view options
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error} - Using sample data for demonstration.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <p className="text-sm font-medium mb-2">Select Visualization Type</p>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} defaultValue="bar">
            <TabsList className="glass grid grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="pie">Pie</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="composed">Combined</TabsTrigger>
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
                {getDataKeys().map(key => (
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
                {getNameKeys().map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="h-96 mb-4 bg-background/30 rounded-lg">
        {renderChart()}
      </div>
      
      {/* Pagination controls - only show for charts that support pagination */}
      {['bar', 'line', 'area', 'composed'].includes(selectedTab) && processedData.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, processedData.length)} to {Math.min(currentPage * ITEMS_PER_PAGE, processedData.length)} of {processedData.length} entries
          </p>
          
          <div className="flex items-center space-x-2">
            <Pagination>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNumber = currentPage === 1 ? i + 1 : 
                                     currentPage === totalPages ? totalPages - 2 + i : 
                                     currentPage - 1 + i;
                  
                  if (pageNumber > 0 && pageNumber <= totalPages) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8"
                      >
                        {pageNumber}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last</span>
              </Button>
            </Pagination>
          </div>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-4">
        <p>This visualization is generated based on the data in {dataset.title}. Use the controls above to change the visualization type and data fields.</p>
      </div>
    </div>
  );
};

export default AdvancedVisualization;
