
import React, { useState } from 'react';
import { Dataset } from '@/types/dataset';
import VisualizationTabs from './VisualizationTabs';
import { AlertCircle, Download, Share, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [sharingUrl, setSharingUrl] = useState(false);

  // Function to handle sharing the visualization
  const handleShareVisualization = async () => {
    setSharingUrl(true);
    
    try {
      // Create a URL with the current tab as a parameter
      const shareUrl = `${window.location.origin}/datasets/${dataset.id}?tab=visualize&mode=${analysisMode}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `${dataset.title} - Visualization`,
          text: `Check out this visualization of ${dataset.title}`,
          url: shareUrl
        });
        toast.success('Visualization shared successfully');
      } else {
        // Fall back to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Visualization link copied to clipboard');
      }
    } catch (err) {
      console.error('Error sharing visualization:', err);
      toast.error('Failed to share visualization');
    } finally {
      setSharingUrl(false);
    }
  };

  // Function to simulate downloading the chart
  const handleDownloadChart = () => {
    setDownloadingChart(true);
    
    // Simulate download process
    setTimeout(() => {
      try {
        // Create a filename based on dataset and visualization type
        const fileName = `${dataset.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${analysisMode}-chart.png`;
        
        toast.success(`Chart downloaded as ${fileName}`, {
          description: 'Find it in your downloads folder'
        });
      } catch (err) {
        toast.error('Failed to download chart');
      } finally {
        setDownloadingChart(false);
      }
    }, 1500);
  };

  return (
    <div className="glass border border-border/50 rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">Visualize This Dataset</h2>
            <p className="text-foreground/70 mt-1">
              Explore the data through interactive visualizations
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleShareVisualization}
                    disabled={sharingUrl}
                  >
                    <Share className="h-4 w-4" />
                    {sharingUrl ? 'Sharing...' : 'Share'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this visualization</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {dataset.source && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={dataset.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Data Source
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View original data source</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <Separator className="mb-6" />
        
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
      
      <div className="border-t border-border/50 p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-xs text-foreground/60">
            Visualization based on {dataset.dataPoints || 'available'} records from {dataset.title}
          </div>
          <div className="text-xs text-foreground/60">
            Last updated: {dataset.date || 'Recently'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationContainer;
