
import React from 'react';
import { Dataset } from '@/types/dataset';
import VisualizationTabs from './VisualizationTabs';
import VisualizationHeader from './VisualizationHeader';
import VisualizationFooter from './VisualizationFooter';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

interface VisualizationContainerProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  dataset,
  visualizationData,
  insights,
  analysisMode,
  setAnalysisMode,
  isLoading = false,
  error = null,
  onRetry
}) => {
  return (
    <div 
      className="glass border border-border/50 rounded-xl overflow-hidden"
      aria-busy={isLoading}
    >
      <div className="p-6">
        <VisualizationHeader 
          dataset={dataset} 
          analysisMode={analysisMode} 
          isLoading={isLoading} 
          error={error} 
        />
        
        <Separator className="mb-6" />
        
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Visualization Error</AlertTitle>
            <AlertDescription>
              {error}
              {onRetry && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={onRetry}
                >
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" aria-hidden="true" />
            <p className="text-muted-foreground mb-4">Processing dataset for visualization</p>
            <div className="max-w-md mx-auto">
              <Progress value={75} className="mb-2" aria-label="Loading progress" />
              <p className="text-xs text-muted-foreground">Generating insights...</p>
            </div>
          </div>
        ) : (
          <ErrorBoundaryWrapper componentName="Visualizations">
            <VisualizationTabs 
              dataset={dataset}
              visualizationData={visualizationData}
              insights={insights}
              analysisMode={analysisMode}
              setAnalysisMode={setAnalysisMode}
              isLoading={isLoading}
            />
          </ErrorBoundaryWrapper>
        )}
      </div>
      
      <VisualizationFooter dataset={dataset} />
    </div>
  );
};

export default VisualizationContainer;
