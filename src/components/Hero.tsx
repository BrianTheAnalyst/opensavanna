
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, PieChart, Layers, Database } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
              <Button size="lg" className="rounded-full group">
                <span>Explore Datasets</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Learn About APIs
              </Button>
            </div>
            
            <div className="mt-12">
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
          </div>
          
          <div className={`relative transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="relative z-10 glass border border-border/50 rounded-2xl p-6 shadow-lg">
              <div className="absolute -top-3 -left-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
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
              
              <Button variant="outline" size="sm" className="w-full rounded-lg">
                View Dataset
              </Button>
            </div>
            
            <div className="absolute top-1/2 -right-12 z-0 glass-light border border-border/50 rounded-2xl p-6 shadow-lg w-64 transform -translate-y-1/2 hidden lg:block">
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
            
            <div className="absolute -bottom-8 -left-4 z-0 glass-light border border-border/50 rounded-2xl p-4 shadow-lg hidden lg:block">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm text-foreground/70">Search by region, format...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
