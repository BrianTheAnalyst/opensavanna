
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Map, FileText, Database } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { getDatasets, getCategoryCounts } from '@/services/datasetService';
import { Dataset } from '@/types/dataset';
import DataQuerySection from '@/components/dataQuery/DataQuerySection';
import ExampleQueriesSection from '@/components/dataQuery/ExampleQueriesSection';
import { toast } from 'sonner';

// Import the components
import FeaturedDatasetsSection from '@/components/home/FeaturedDatasetsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import DataVisualizationSection from '@/components/home/DataVisualizationSection';
import ApiDeveloperSection from '@/components/home/ApiDeveloperSection';
import CallToActionSection from '@/components/home/CallToActionSection';

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
  
  const location = useLocation();
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      // Get datasets from the database
      const datasets = await getDatasets();
      
      // Filter featured datasets - either tagged as featured or take the most recent ones
      const featured = datasets.filter(d => d.featured).length > 0 
        ? datasets.filter(d => d.featured)
        : datasets.slice(0, 4);
      
      setFeaturedDatasets(featured);
      
      // Get category counts using our new function
      const categoryCounts = await getCategoryCounts();
      
      if (categoryCounts && categoryCounts.length > 0) {
        setVisData(categoryCounts);
        
        // Update category counts in the UI
        setCategories(prev => 
          prev.map(cat => ({
            ...cat,
            count: categoryCounts.find(c => 
              c.name.toLowerCase() === cat.title.toLowerCase()
            )?.value || 0
          }))
        );
      } else {
        // Fallback if we couldn't get category counts
        const categoryMap: Record<string, number> = {};
        
        datasets.forEach(dataset => {
          const category = dataset.category;
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        });
        
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
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading homepage data:', error);
      setIsLoaded(true);
    }
  }, []);
  
  useEffect(() => {
    // Check for query parameter in URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if (query) {
      setActiveQuery(query);
    }
    
    fetchData();
  }, [location, fetchData]);

  const handleSearch = async (query: string) => {
    setActiveQuery(query);
    
    // Update the URL to include the query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url);

    // Scroll to the search section with proper offset for navbar
    setTimeout(() => {
      const searchElement = document.getElementById('search-section');
      if (searchElement) {
        const offset = 100; // Account for fixed navbar
        const elementPosition = searchElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleQuerySelect = (query: string) => {
    setActiveQuery(query);
    handleSearch(query);
    toast.info('Loading query results...');
  };

  const handleDatasetUpdate = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with Search Feature */}
        <section className="relative">
          <Hero onSearch={handleSearch} />
        </section>
        
        {/* Example Queries Section - Shows options for exploration */}
        <section className="py-12 bg-muted/30">
          <ExampleQueriesSection onQuerySelect={handleQuerySelect} />
        </section>
        
        {/* Data Query Section - Results area */}
        {activeQuery && (
          <DataQuerySection initialQuery={activeQuery} />
        )}
        
        {/* Featured Datasets - Show what's available */}
        <section className="py-16 bg-background">
          <FeaturedDatasetsSection 
            datasets={featuredDatasets} 
            isLoaded={isLoaded} 
            onDataChange={handleDatasetUpdate}
          />
        </section>
        
        {/* Data Visualization - Show capabilities */}
        <section className="py-16 bg-muted/20">
          <DataVisualizationSection 
            isLoaded={isLoaded} 
            visData={visData} 
          />
        </section>
        
        {/* Data Categories - Browse options */}
        <section className="py-16 bg-background">
          <CategoriesSection 
            isLoaded={isLoaded} 
            categories={categories} 
          />
        </section>
        
        {/* API & Developer Tools */}
        <section className="py-16 bg-muted/20">
          <ApiDeveloperSection isLoaded={isLoaded} />
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-background">
          <CallToActionSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
