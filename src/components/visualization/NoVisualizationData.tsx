
import React from 'react';
import { AlertTriangle, FileText, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NoVisualizationDataProps {
  onRetry?: () => void;
  error?: string;
}

const NoVisualizationData: React.FC<NoVisualizationDataProps> = ({ 
  onRetry,
  error
}) => {
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <div className="flex items-start">
        <div className="mr-4 bg-yellow-100 p-2 rounded-full">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-medium mb-2">Visualization Not Available</h2>
          <p className="text-foreground/70 mb-4">
            We couldn't generate visualizations for this dataset. This might be due to the data format or file not being accessible.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-800">
              <span className="font-medium">Error details: </span>{error}
            </div>
          )}
          
          <div className="space-y-2 text-sm text-foreground/70 mb-4">
            <p>Possible reasons:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>The file format is not supported for visualization</li>
              <li>The dataset file could not be parsed correctly</li>
              <li>The data structure doesn't contain visualization-friendly fields</li>
              <li>The dataset might be empty or contain invalid data</li>
            </ul>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                className="flex items-center" 
                variant="secondary" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            )}
            
            <Link to="/datasets">
              <Button variant="outline" size="sm" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Browse Other Datasets
              </Button>
            </Link>
            
            <Link to="/upload">
              <Button size="sm" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Dataset
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoVisualizationData;
