
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, PieChart, FileText, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DatasetGrid from '@/components/DatasetGrid';
import Visualization from '@/components/Visualization';
import Footer from '@/components/Footer';

// Sample datasets for demo
const demoDatasets = [
  {
    id: '1',
    title: 'Economic Indicators by Region',
    description: 'Comprehensive collection of economic indicators across different regions including GDP, inflation, and employment rates.',
    category: 'Economics',
    format: 'CSV',
    country: 'Global',
    date: 'Updated June 2023',
    downloads: 5248,
    featured: true
  },
  {
    id: '2',
    title: 'Healthcare Facility Locations',
    description: 'Geographic dataset of healthcare facilities including hospitals, clinics, and specialized care centers.',
    category: 'Health',
    format: 'GeoJSON',
    country: 'South Africa',
    date: 'Updated May 2023',
    downloads: 3129
  },
  {
    id: '3',
    title: 'Public Transportation Usage',
    description: 'Time series data showing public transportation usage patterns across major metropolitan areas.',
    category: 'Transport',
    format: 'JSON',
    country: 'Nigeria',
    date: 'Updated April 2023',
    downloads: 2847
  },
  {
    id: '4',
    title: 'Agricultural Production Statistics',
    description: 'Annual agricultural production statistics for major crops and livestock by region.',
    category: 'Agriculture',
    format: 'CSV',
    country: 'Kenya',
    date: 'Updated March 2023',
    downloads: 2156
  }
];

// Sample visualization data
const sampleVisData = [
  { name: 'Economics', value: 426 },
  { name: 'Health', value: 348 },
  { name: 'Transport', value: 276 },
  { name: 'Agriculture', value: 219 },
  { name: 'Education', value: 187 },
  { name: 'Environment', value: 156 },
  { name: 'Demographics', value: 98 }
];

const categories = [
  { title: 'Economics', icon: PieChart, count: 426, description: 'GDP, inflation, trade, employment' },
  { title: 'Health', icon: Map, count: 348, description: 'Healthcare facilities, disease data, health indicators' },
  { title: 'Transport', icon: Map, count: 276, description: 'Public transport, road networks, traffic data' },
  { title: 'Agriculture', icon: FileText, count: 219, description: 'Crop production, livestock, agricultural statistics' }
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredDatasets, setFeaturedDatasets] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedDatasets(demoDatasets);
      setIsLoaded(true);
    }, 500);
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
                  data={sampleVisData} 
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
