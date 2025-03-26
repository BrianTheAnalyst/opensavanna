
import { Link } from 'react-router-dom';
import { PieChart, Layers, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FeaturedDatasetCardProps {
  isLoaded: boolean;
}

const FeaturedDatasetCard = ({ isLoaded }: FeaturedDatasetCardProps) => {
  return (
    <div className={`relative transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="relative z-10 border border-border/50 rounded-2xl p-6 shadow-lg bg-background">
        <div className="absolute -top-3 -left-3 bg-primary text-white text-xs px-3 py-1 rounded-full z-20">
          Most Popular
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Economic Indicators Dataset</h3>
          <p className="text-sm text-foreground/70">Comprehensive collection of economic indicators across different regions.</p>
        </div>
        
        <div className="relative h-48 bg-muted rounded-lg overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <PieChart className="h-16 w-16 text-primary/40" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">Economics</span>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">CSV</span>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">Updated Weekly</span>
        </div>
        
        <Link to="/datasets/1">
          <Button variant="outline" size="sm" className="w-full rounded-lg">
            View Dataset
          </Button>
        </Link>
      </div>
      
      <div className="absolute top-1/2 -right-12 z-0 border border-border/50 bg-background/90 rounded-2xl p-6 shadow-lg w-64 transform -translate-y-1/2 hidden lg:block">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-3">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Health Datasets</h4>
            <p className="text-xs text-foreground/70">346 datasets available</p>
          </div>
        </div>
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-primary rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute -bottom-8 -left-4 z-0 border border-border/50 bg-background/90 rounded-2xl p-4 shadow-lg hidden lg:block">
        <div className="flex items-center">
          <Search className="h-4 w-4 text-primary mr-2" />
          <span className="text-sm text-foreground/70">Search by region, format...</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDatasetCard;
