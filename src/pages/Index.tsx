
/**
 * Clean, minimal home page demonstrating the new architecture
 * Production-ready with security and performance optimizations
 */

import React, { useState, useCallback } from 'react';
import { ErrorBoundary } from '@/components/core/ErrorBoundary';
import { SecureInput } from '@/components/core/SecureInput';
import { DataProcessor } from '@/components/core/DataProcessor';
import { useSecureStringState, useSecureNumberState } from '@/hooks/useSecureState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, Zap, Code } from 'lucide-react';
import type { DataPoint } from '@/types/core';

const Index = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const nameState = useSecureStringState();
  const valueState = useSecureNumberState(0, 0, 10000);
  
  const handleAddData = useCallback(() => {
    if (nameState.value && valueState.value >= 0) {
      const newDataPoint: DataPoint = {
        id: crypto.randomUUID(),
        value: valueState.value,
        timestamp: new Date(),
        metadata: {
          name: nameState.value,
          source: 'user_input'
        }
      };
      
      setData(prev => [newDataPoint, ...prev].slice(0, 100)); // Limit to 100 items
      nameState.reset();
      valueState.reset();
    }
  }, [nameState, valueState]);
  
  const handleProcess = useCallback((processedData: DataPoint[]) => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      console.log('Processed data:', processedData);
      setIsProcessing(false);
    }, 1000);
  }, []);
  
  const features = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Input sanitization, validation, and secure coding practices'
    },
    {
      icon: Zap,
      title: 'Performance Optimized',
      description: 'Debounced inputs, chunked processing, and memory management'
    },
    {
      icon: Database,
      title: 'Type Safe',
      description: 'Full TypeScript coverage with strict type checking'
    },
    {
      icon: Code,
      title: 'Clean Architecture',
      description: 'Modular design with separation of concerns'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Production-Ready Foundation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A clean, secure, and performant architecture built with modern best practices.
            Focused on security, performance, and maintainability.
          </p>
        </div>
        
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <feature.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Interactive Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Secure Data Input
                <Badge variant="outline" className="ml-auto">Demo</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SecureInput
                id="name"
                label="Data Name"
                value={nameState.value}
                onChange={nameState.update}
                placeholder="Enter a descriptive name"
                required
                maxLength={50}
              />
              
              <SecureInput
                id="value"
                label="Value"
                type="number"
                value={valueState.value}
                onChange={valueState.update}
                placeholder="Enter a numeric value"
                required
                min={0}
                max={10000}
              />
              
              <Button 
                onClick={handleAddData} 
                className="w-full"
                disabled={!nameState.value || valueState.value < 0}
              >
                Add Data Point
              </Button>
              
              {(nameState.error || valueState.error) && (
                <div className="text-sm text-red-600">
                  Please fix the errors above before proceeding.
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Data Processing */}
          <ErrorBoundary>
            <DataProcessor
              data={data}
              onProcess={handleProcess}
              isProcessing={isProcessing}
              maxBatchSize={50}
            />
          </ErrorBoundary>
        </div>
        
        {/* Data Display */}
        {data.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Recent Data Points
                <Badge variant="outline" className="ml-auto">
                  {data.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.slice(0, 10).map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{point.metadata?.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {point.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {point.value.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
