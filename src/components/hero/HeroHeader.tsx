
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";

interface HeroHeaderProps {
  isLoaded: boolean;
}

const HeroHeader = ({ isLoaded }: HeroHeaderProps) => {
  return (
    <div className={`transition-all duration-700 delay-100 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary/10 rounded-full animate-fade-in">
        Africa's Open Data Hub
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
        Discover insights through <span className="text-primary">open data</span>
      </h1>
      <p className="text-lg text-foreground/70 mb-8 max-w-md">
        Access, visualize, and leverage public datasets to drive research, policy decisions, and innovative applications.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/datasets">
          <Button size="lg" className="rounded-full group">
            <span>Explore Datasets</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/api">
          <Button size="lg" variant="outline" className="rounded-full">
            Learn About APIs
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroHeader;
