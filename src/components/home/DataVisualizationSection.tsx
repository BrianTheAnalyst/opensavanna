
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Visualization from '@/components/Visualization';

interface DataVisualizationSectionProps {
  isLoaded: boolean;
  visData: any[];
}

const DataVisualizationSection = ({ isLoaded, visData }: DataVisualizationSectionProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
              Visual Insights
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-4">
              Visualize and Understand Data
            </h2>
            <p className="text-foreground/70 mb-6">
              Transform raw data into meaningful visualizations. Our platform provides tools to create charts, maps, and interactive dashboards to help you extract insights.
            </p>
            <ul className="space-y-3 mb-8">
              {['Interactive charts and graphs', 'Geospatial mapping capabilities', 'Customizable dashboards', 'Export and share visualizations'].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/datasets">
              <Button className="rounded-full group">
                <span>Explore Visualizations</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Visualization 
              data={visData} 
              title="Datasets by Category" 
              description="Distribution of datasets across different categories in the platform."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualizationSection;
