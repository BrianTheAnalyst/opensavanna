
import React, { useState, useEffect } from 'react';
import { PieChart, Map, FileText, Database, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import DatasetGrid from '@/components/DatasetGrid';
import Footer from '@/components/Footer';

// Sample data
const allDatasets = [
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
  },
  {
    id: '5',
    title: 'Education Access and Completion Rates',
    description: 'Data on education access, enrollment, and completion rates across different regions and demographics.',
    category: 'Education',
    format: 'CSV',
    country: 'Ghana',
    date: 'Updated June 2023',
    downloads: 1845
  },
  {
    id: '6',
    title: 'Climate Data by Region',
    description: 'Time series climate data including temperature, precipitation, and other environmental indicators.',
    category: 'Environment',
    format: 'JSON',
    country: 'East Africa',
    date: 'Updated May 2023',
    downloads: 1732
  },
  {
    id: '7',
    title: 'Population Demographics',
    description: 'Demographic data including age distribution, gender ratios, and population density by region.',
    category: 'Demographics',
    format: 'CSV',
    country: 'West Africa',
    date: 'Updated April 2023',
    downloads: 1621
  },
  {
    id: '8',
    title: 'COVID-19 Case Statistics',
    description: 'Historical data on COVID-19 cases, hospitalizations, recoveries, and vaccination rates.',
    category: 'Health',
    format: 'CSV',
    country: 'Africa',
    date: 'Updated March 2023',
    downloads: 1597
  },
  {
    id: '9',
    title: 'Election Results and Voting Patterns',
    description: 'Historical election results, voter turnout, and voting patterns by region.',
    category: 'Government',
    format: 'JSON',
    country: 'Nigeria',
    date: 'Updated February 2023',
    downloads: 1483
  }
];

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

const formats = [
  { label: 'CSV', value: 'csv', count: 874 },
  { label: 'JSON', value: 'json', count: 523 },
  { label: 'GeoJSON', value: 'geojson', count: 217 },
  { label: 'Excel', value: 'excel', count: 156 },
  { label: 'API', value: 'api', count: 89 }
];

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
  const [datasets, setDatasets] = useState<any[]>([]);
  const [filters, setFilters] = useState({});
  const [featuredCategory, setFeaturedCategory] = useState({
    title: 'Economics',
    icon: PieChart,
    description: 'Explore economic datasets including GDP, inflation, trade, and employment statistics.'
  });
  
  useEffect(() => {
    // Simulate API call with loading delay
    const timer = setTimeout(() => {
      setDatasets(allDatasets);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
    
    // In a real application, this would filter the datasets based on the filters
    // For now, we'll just simulate a loading state and then return all datasets
    setIsLoading(true);
    setTimeout(() => {
      setDatasets(allDatasets);
      setIsLoading(false);
    }, 500);
  };
  
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
            </div>
          </div>
        </section>
        
        {/* Featured Category */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="glass border border-border/50 rounded-2xl overflow-hidden mb-10 animate-scale-in">
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
                      <div key={i} className="glass-light rounded-lg p-3">
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
