
import { AlertTriangle, FileText, Upload, RefreshCw, Info } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

interface NoVisualizationDataProps {
  onRetry?: () => void;
  error?: string;
}

const NoVisualizationData: React.FC<NoVisualizationDataProps> = ({ 
  onRetry,
  error
}) => {
  const handleRetry = () => {
    toast.info('Retrying visualization loading...');
    if (onRetry) {
      onRetry();
    }
  };

  // Determine error type for better guidance
  const getErrorType = (error?: string) => {
    if (!error) return 'unknown';
    if (error.toLowerCase().includes('format') || error.toLowerCase().includes('parse')) return 'format';
    if (error.toLowerCase().includes('empty') || error.toLowerCase().includes('no data')) return 'empty';
    if (error.toLowerCase().includes('access') || error.toLowerCase().includes('permission')) return 'access';
    return 'data';
  };

  const errorType = getErrorType(error);

  // Get specific recommendations based on error type
  const getRecommendation = () => {
    switch (errorType) {
      case 'format':
        return "Try uploading your file in CSV, JSON, or Excel format with clear column headers.";
      case 'empty':
        return "Make sure your dataset contains records and is not empty.";
      case 'access':
        return "Check if the file permissions allow access or try re-uploading the dataset.";
      case 'data':
        return "The data structure may not be suitable for visualization. Ensure it contains numeric values.";
      default:
        return "Try a different dataset or contact support if the problem persists.";
    }
  };

  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <div className="flex items-start">
        <div className="mr-4 bg-yellow-100 p-2 rounded-full">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-medium mb-2">Visualization Not Available</h2>
          <p className="text-foreground/70 mb-4">
            We couldn't generate visualizations for this dataset. This might be due to the data format or file not being accessible.
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                <span className="font-medium">Error details: </span>{error}
              </AlertDescription>
            </Alert>
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
          
          <Alert variant="default" className="bg-blue-50 border-blue-100 mb-4">
            <Info className="h-4 w-4 text-blue-500 mr-2" />
            <AlertDescription className="text-blue-800">
              <span className="font-medium">Recommendation: </span>
              {getRecommendation()}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 flex flex-wrap gap-3">
            {onRetry && (
              <Button 
                onClick={handleRetry} 
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
