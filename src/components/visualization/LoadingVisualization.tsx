
import { Loader2 } from 'lucide-react';
import React from 'react';

import { Progress } from '@/components/ui/progress';

const LoadingVisualization: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 10, 100);
      });
    }, 500);
    
    return () => { clearInterval(interval); };
  }, []);
  
  return (
    <div className="glass border border-border/50 rounded-xl p-6 mb-6">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <span className="text-foreground/70 text-center font-medium mb-2">
          Analyzing dataset and generating visualizations...
        </span>
        <span className="text-sm text-foreground/60 text-center mb-6 max-w-md">
          This may take a moment depending on the dataset size and complexity. We're processing your data to create meaningful visualizations.
        </span>
        
        <div className="w-full max-w-md mb-2">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="text-xs text-foreground/50 text-center">
          {progress < 100 ? `Processing... ${Math.round(progress)}%` : 'Finalizing visualizations...'}
        </div>
      </div>
    </div>
  );
};

export default LoadingVisualization;
