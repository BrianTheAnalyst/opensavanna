
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, PieChart, FileText, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DatasetGrid from '@/components/DatasetGrid';
import Visualization from '@/components/Visualization';
import Footer from '@/components/Footer';
import { getDatasets } from '@/services/datasetService';
import { Dataset } from '@/types/dataset';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredDatasets, setFeaturedDatasets] = useState<Dataset[]>([]);
  const [visData, setVisData] = useState<any[]>([]);
  const [categories, setCategories] = useState([
    { title: 'Economics', icon: PieChart, count: 0, description: 'GDP, inflation, trade, employment' },
    { title: 'Health', icon: Map, count: 0, description: 'Healthcare facilities, disease data, health indicators' },
    { title: 'Transport', icon: Map, count: 0, description: 'Public transport, road networks, traffic data' },
    { title: 'Agriculture', icon: FileText, count: 0, description: 'Crop production, livestock, agricultural statistics' }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get datasets from the database
        const datasets = await getDatasets();
        
        // Filter featured datasets - either tagged as featured or take the most recent ones
        const featured = datasets.filter(d => d.featured).length > 0 
          ? datasets.filter(d => d.featured)
          : datasets.slice(0, 4);
        
        setFeaturedDatasets(featured);
        
        // Get category counts from the database
        const { data: categoryCounts } = await supabase
          .from('datasets')
          .select('category, count')
          .then(result => {
            if (result.error) {
              console.error('Error fetching category counts:', result.error);
              return { data: null };
            }
            return result;
          });
        
        // Generate visualization data based on actual categories in the database
        const categoryData = categoryCounts ? categoryCounts : [];
        
        // If we have categories from the database, use them for visualization
        if (categoryCounts && categoryCounts.length > 0) {
          setVisData(
            categoryCounts.map(item => ({
              name: item.category,
              value: parseInt(item.count)
            }))
          );
        } else {
          // If no categories or counts, fetch distinct categories and count them
          const { data } = await supabase
            .from('datasets')
            .select('category');
          
          if (data) {
            // Count occurrences of each category
            const categoryMap = data.reduce((acc, item) => {
              acc[item.category] = (acc[item.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            
            // Convert to array format for visualization
            const visDataArray = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
            setVisData(visDataArray);
            
            // Update category counts in the UI
            setCategories(prev => 
              prev.map(cat => ({
                ...cat,
                count: categoryMap[cat.title.toLowerCase()] || 0
              }))
            );
          }
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading homepage data:', error);
        setIsLoaded(true);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Datasets */}
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
              datasets={featuredDatasets} 
              loading={!isLoaded} 
              layout="featured" 
            />
          </div>
        </section>
        
        {/* Data Categories */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Browse by Category
              </div>
              <h2 className="text-3xl font-medium tracking-tight mb-4">
                Explore Data Categories
              </h2>
              <p className="text-foreground/70 max-w-xl mx-auto">
                Discover datasets organized by category to find exactly what you need for your research, applications, or analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link 
                    key={category.title} 
                    to={`/datasets?category=${category.title.toLowerCase()}`}
                    className={`glass border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 transform ${
                      isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{category.title}</h3>
                        <p className="text-foreground/60 text-sm">
                          {category.count} datasets
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Explore Category
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/datasets">
                <Button variant="outline" className="rounded-full">
                  View All Categories
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Data Visualization */}
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
        
        {/* API & Developer Tools */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={`glass border border-border/50 rounded-xl overflow-hidden transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="p-6">
                  <div className="font-mono text-sm text-foreground/80 bg-muted p-4 rounded-lg overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      <code>{`// Sample API call to fetch datasets
fetch('https://api.opendata.org/v1/datasets')
  .then(response => response.json())
  .then(data => {
    console.log('Total datasets:', data.count);
    console.log('Results:', data.results);
  })
  .catch(error => console.error(error));`}</code>
                    </pre>
                  </div>
                </div>
                <div className="border-t border-border/50 p-4 bg-muted/30 flex justify-between items-center">
                  <div className="text-sm text-foreground/60">api.opendata.org/v1/datasets</div>
                  <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">GET</div>
                </div>
              </div>
              
              <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                  Developer Tools
                </div>
                <h2 className="text-3xl font-medium tracking-tight mb-4">
                  Powerful API Access
                </h2>
                <p className="text-foreground/70 mb-6">
                  Integrate our data directly into your applications with our developer-friendly API. Access all datasets programmatically for seamless integration.
                </p>
                <ul className="space-y-3 mb-8">
                  {['RESTful API endpoints', 'Comprehensive documentation', 'Authentication & rate limiting', 'Webhook notifications'].map((item, i) => (
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
                <Link to="/api">
                  <Button className="rounded-full group">
                    <span>View API Documentation</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container px-4 mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/20 rounded-full">
              Join the Community
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 max-w-2xl mx-auto">
              Ready to unlock the power of open data?
            </h2>
            <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
              Start exploring our datasets or contribute your own data to help build a more open and accessible data ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/datasets">
                <Button size="lg" className="rounded-full group">
                  <span>Explore Datasets</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="rounded-full">
                  <Database className="mr-2 h-4 w-4" />
                  Contribute Data
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
