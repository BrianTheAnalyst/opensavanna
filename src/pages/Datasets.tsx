
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Map, FileText, Database, BarChart3, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import DatasetGrid from '@/components/DatasetGrid';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { getDatasets, Dataset } from '@/services/api';

// Category icons mapping
const categoryIcons: Record<string, any> = {
  'Economics': PieChart,
  'Health': Map,
  'Transport': Map,
  'Agriculture': FileText,
  'Education': Database,
  'Environment': Map,
  'Demographics': BarChart3,
  'Government': Database
};

// Category data
const categories = [
  { label: 'Economics', value: 'economics', count: 426 },
  { label: 'Health', value: 'health', count: 348 },
  { label: 'Transport', value: 'transport', count: 276 },
  { label: 'Agriculture', value: 'agriculture', count: 219 },
  { label: 'Education', value: 'education', count: 187 },
  { label: 'Environment', value: 'environment', count: 156 },
  { label: 'Demographics', value: 'demographics', count: 98 },
  { label: 'Government', value: 'government', count: 85 }
];

// Format data
const formats = [
  { label: 'CSV', value: 'csv', count: 874 },
  { label: 'JSON', value: 'json', count: 523 },
  { label: 'GeoJSON', value: 'geojson', count: 217 },
  { label: 'Excel', value: 'excel', count: 156 },
  { label: 'API', value: 'api', count: 89 }
];

// Region data
const regions = [
  { label: 'Global', value: 'global', count: 423 },
  { label: 'East Africa', value: 'east-africa', count: 385 },
  { label: 'West Africa', value: 'west-africa', count: 367 },
  { label: 'South Africa', value: 'south-africa', count: 291 },
  { label: 'North Africa', value: 'north-africa', count: 248 },
  { label: 'Central Africa', value: 'central-africa', count: 145 }
];

const Datasets = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    format: '',
    country: ''
  });
  const [featuredCategory, setFeaturedCategory] = useState({
    title: 'Economics',
    icon: PieChart,
    description: 'Explore economic datasets including GDP, inflation, trade, and employment statistics.'
  });
  
  useEffect(() => {
    const loadDatasets = async () => {
      setIsLoading(true);
      try {
        const data = await getDatasets(filters);
        setDatasets(data);
      } catch (error) {
        console.error('Failed to load datasets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDatasets();
  }, [filters]);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header */}
        <section className="bg-muted/30 py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Data Explorer
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                Explore Our Datasets
              </h1>
              <p className="text-foreground/70 mb-4">
                Browse, filter, and discover our collection of open datasets covering various sectors, regions, and formats.
              </p>
              <Link to="/upload">
                <Button className="mt-2 cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload New Dataset
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Category */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="border border-border/50 bg-background/90 rounded-2xl overflow-hidden mb-10 animate-scale-in">
              <div className="grid md:grid-cols-3 items-center">
                <div className="p-8 md:col-span-2">
                  <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                    Featured Category
                  </div>
                  <h2 className="text-2xl font-medium mb-2">
                    {featuredCategory.title} Datasets
                  </h2>
                  <p className="text-foreground/70 mb-6">
                    {featuredCategory.description}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Datasets', value: '400+' },
                      { label: 'Updated This Month', value: '47' },
                      { label: 'Data Sources', value: '12' },
                      { label: 'Average Downloads', value: '1.8K' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-background/90 rounded-lg p-3 border border-border/50">
                        <div className="text-lg font-medium">{stat.value}</div>
                        <div className="text-xs text-foreground/60">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-full p-8 bg-gradient-to-br from-primary/10 to-primary/5 hidden md:flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {React.createElement(featuredCategory.icon, { size: 64 })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filter Bar */}
            <FilterBar 
              categories={categories}
              formats={formats}
              regions={regions}
              onFilterChange={handleFilterChange}
            />
            
            {/* Dataset Grid */}
            <DatasetGrid 
              datasets={datasets} 
              loading={isLoading} 
              columns={3}
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Datasets;
