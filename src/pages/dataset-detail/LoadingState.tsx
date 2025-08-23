
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";

export const LoadingState = () => {
  return (
    <div className="glass border border-border/50 rounded-xl p-8 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-muted rounded w-full mb-2"></div>
      <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-6 bg-muted rounded-full w-20"></div>
        <div className="h-6 bg-muted rounded-full w-16"></div>
        <div className="h-6 bg-muted rounded-full w-24"></div>
      </div>
      
      <div className="h-10 bg-muted rounded w-full mb-6"></div>
      <div className="h-64 bg-muted rounded w-full"></div>
    </div>
  );
};

export const NotFoundState = () => {
  return (
    <div className="glass border border-border/50 rounded-xl p-8">
      <h1 className="text-2xl md:text-3xl font-medium mb-4">Dataset Not Found</h1>
      <p className="text-foreground/70 mb-6">
        The dataset you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/datasets">
        <Button>Back to All Datasets</Button>
      </Link>
    </div>
  );
};
