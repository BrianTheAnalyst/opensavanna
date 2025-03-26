
import { Database, Layers, PieChart } from 'lucide-react';

interface HeroStatsProps {
  isLoaded: boolean;
}

const HeroStats = ({ isLoaded }: HeroStatsProps) => {
  return (
    <div className={`mt-12 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-300`}>
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-primary" />
          <span>2,456 Datasets</span>
        </div>
        <div className="flex items-center">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          <span>54 Categories</span>
        </div>
        <div className="flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          <span>Interactive Visualizations</span>
        </div>
      </div>
    </div>
  );
};

export default HeroStats;
