
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredDatasets, setFeaturedDatasets] = useState<Dataset[]>([]);
  const [visData, setVisData] = useState<any[]>([]);
  
  const location = useLocation();
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      const datasets = await getDatasets();
      const featured = datasets.filter(d => d.featured).length > 0 
        ? datasets.filter(d => d.featured)
        : datasets.slice(0, 3); // Reduced to 3 for cleaner layout
      
      setFeaturedDatasets(featured);
      
      const categoryCounts = await getCategoryCounts();
      if (categoryCounts && categoryCounts.length > 0) {
        setVisData(categoryCounts);
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading homepage data:', error);
      setIsLoaded(true);
    }
  }, []);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if (query) {
      setActiveQuery(query);
    }
    fetchData();
  }, [location, fetchData]);

  const handleSearch = async (query: string) => {
    setActiveQuery(query);
    
    const url = new URL(window.location.href);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url);

    setTimeout(() => {
      const searchElement = document.getElementById('search-section');
      if (searchElement) {
        const offset = 100;
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
        <section className="relative mb-16">
          <Hero onSearch={handleSearch} />
        </section>
        
        {/* Example Queries Section - Only show if no active query */}
        {!activeQuery && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto max-w-7xl px-6">
              <ExampleQueriesSection onQuerySelect={handleQuerySelect} />
            </div>
          </section>
        )}
        
        {/* Data Query Section - Results area */}
        {activeQuery && (
          <section className="mb-16">
            <DataQuerySection initialQuery={activeQuery} />
          </section>
        )}
        
        {/* Featured Datasets - Show what's available */}
        {!activeQuery && (
          <section className="py-20 bg-background">
            <div className="container mx-auto max-w-7xl px-6">
              <FeaturedDatasetsSection 
                datasets={featuredDatasets} 
                isLoaded={isLoaded} 
                onDataChange={handleDatasetUpdate}
              />
            </div>
          </section>
        )}
        
        {/* Data Visualization Overview - Show capabilities */}
        {!activeQuery && isLoaded && visData.length > 0 && (
          <section className="py-20 bg-muted/10">
            <div className="container mx-auto max-w-7xl px-6">
              <DataVisualizationSection 
                isLoaded={isLoaded} 
                visData={visData} 
              />
            </div>
          </section>
        )}
        
        {/* Data Categories - Browse options */}
        {!activeQuery && (
          <section className="py-20 bg-background">
            <div className="container mx-auto max-w-7xl px-6">
              <CategoriesSection isLoaded={isLoaded} />
            </div>
          </section>
        )}
        
        {/* API & Developer Tools */}
        {!activeQuery && (
          <section className="py-20 bg-muted/10">
            <div className="container mx-auto max-w-7xl px-6">
              <ApiDeveloperSection isLoaded={isLoaded} />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
