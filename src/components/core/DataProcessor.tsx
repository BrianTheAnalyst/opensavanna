
/**
 * Secure data processing component
 * Handles data transformation with security and performance optimizations
 */

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { chunkArray } from '@/utils/performance';
import type { DataPoint, ProcessingResult } from '@/types/core';

interface DataProcessorProps {
  data: readonly DataPoint[];
  onProcess: (processedData: DataPoint[]) => void;
  isProcessing?: boolean;
  maxBatchSize?: number;
  className?: string;
}

export const DataProcessor: React.FC<DataProcessorProps> = ({
  data,
  onProcess,
  isProcessing = false,
  maxBatchSize = 100,
  className
}) => {
  // Memoized data statistics for performance
  const stats = useMemo(() => {
    if (data.length === 0) {
      return { count: 0, avgValue: 0, minValue: 0, maxValue: 0 };
    }
    
    const values = data.map(point => point.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    
    return {
      count: data.length,
      avgValue: sum / data.length,
      minValue: Math.min(...values),
      maxValue: Math.max(...values)
    };
  }, [data]);
  
  // Secure data processing with chunking for large datasets
  const processData = useCallback(async () => {
    if (data.length === 0) return;
    
    try {
      const processedData: DataPoint[] = [];
      
      // Process in chunks to avoid blocking the main thread
      for (const chunk of chunkArray(data, maxBatchSize)) {
        // Simulate async processing with proper error handling
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const processedChunk = chunk
          .filter(point => point.value !== null && point.value !== undefined)
          .map(point => ({
            ...point,
            value: Math.max(0, point.value), // Ensure non-negative values
            timestamp: new Date(point.timestamp) // Ensure valid date
          }));
        
        processedData.push(...processedChunk);
      }
      
      onProcess(processedData);
    } catch (error) {
      console.error('Data processing error:', error);
    }
  }, [data, maxBatchSize, onProcess]);
  
  const getStatusIcon = () => {
    if (isProcessing) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (data.length > 0) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };
  
  const getStatusText = () => {
    if (isProcessing) return 'Processing...';
    if (data.length > 0) return 'Ready to process';
    return 'No data available';
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Data Processor
          <Badge variant="outline" className="ml-auto">
            {stats.count} items
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {data.length > 0 && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Average:</span>
              <span className="ml-2 font-mono">{stats.avgValue.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Range:</span>
              <span className="ml-2 font-mono">
                {stats.minValue.toFixed(1)} - {stats.maxValue.toFixed(1)}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {getStatusText()}
          </span>
          
          <Button
            onClick={processData}
            disabled={isProcessing || data.length === 0}
            size="sm"
          >
            {isProcessing ? 'Processing...' : 'Process Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
