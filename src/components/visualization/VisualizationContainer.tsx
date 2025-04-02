
import React, { useState } from 'react';
import { Dataset } from '@/types/dataset';
import VisualizationTabs from './VisualizationTabs';
import { AlertCircle, Download, Share } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VisualizationContainerProps {
  dataset: Dataset;
  visualizationData: any[];
  insights: string[];
  analysisMode: 'overview' | 'detailed' | 'advanced';
  setAnalysisMode: (mode: 'overview' | 'detailed' | 'advanced') => void;
  isLoading?: boolean;
  error?: string;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  dataset,
  visualizationData,
  insights,
  analysisMode,
  setAnalysisMode,
  isLoading = false,
  error
}) => {
  const [downloadingChart, setDownloadingChart] = useState(false);

  // Function to handle sharing the visualization
  const handleShareVisualization = () => {
    // Create a URL with the current tab as a parameter
    const shareUrl = `${window.location.origin}/datasets/${dataset.id}?tab=visualize&mode=${analysisMode}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl);
    toast.success('Visualization link copied to clipboard');
  };

  // Function to simulate downloading the chart
  const handleDownloadChart = () => {
    setDownloadingChart(true);
    
    setTimeout(() => {
      setDownloadingChart(false);
      toast.success('Chart downloaded successfully');
    }, 1500);
  };

  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-medium">Visualize This Dataset</h2>
          <p className="text-foreground/70">
            Explore the data through interactive visualizations. Select different views and parameters to discover insights.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleShareVisualization}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleDownloadChart}
            disabled={downloadingChart || isLoading || !!error}
          >
            <Download className="h-4 w-4" />
            {downloadingChart ? 'Downloading...' : 'Download Chart'}
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Visualization Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <VisualizationTabs 
        dataset={dataset}
        visualizationData={visualizationData}
        insights={insights}
        analysisMode={analysisMode}
        setAnalysisMode={setAnalysisMode}
        isLoading={isLoading}
      />
    </div>
  );
};

export default VisualizationContainer;
