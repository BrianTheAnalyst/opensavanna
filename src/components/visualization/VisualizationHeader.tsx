
import { Share, Download, ExternalLink } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dataset } from '@/types/dataset';

interface VisualizationHeaderProps {
  dataset: Dataset;
  analysisMode: 'overview' | 'detailed' | 'advanced';
  isLoading?: boolean;
  error?: string;
}

const VisualizationHeader: React.FC<VisualizationHeaderProps> = ({
  dataset,
  analysisMode,
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
  );
};

export default VisualizationHeader;
