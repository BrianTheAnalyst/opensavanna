
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DatasetGrid from '@/components/DatasetGrid';
import { Dataset } from '@/types/dataset';

interface FeaturedDatasetsSectionProps {
  datasets: Dataset[];
  isLoaded: boolean;
}

const FeaturedDatasetsSection = ({ datasets, isLoaded }: FeaturedDatasetsSectionProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
              Curated Collections
            </div>
            <h2 className="text-3xl font-medium tracking-tight">Featured Datasets</h2>
          </div>
          <Link to="/datasets">
            <Button variant="ghost" className="group">
              View All Datasets
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <DatasetGrid 
          datasets={datasets} 
          loading={!isLoaded} 
          layout="featured" 
        />
      </div>
    </section>
  );
};

export default FeaturedDatasetsSection;
