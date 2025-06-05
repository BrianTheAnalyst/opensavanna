
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { getDatasets, getCategoryCounts } from '@/services/datasetService';
import { Dataset } from '@/types/dataset';
import DataQuerySection from '@/components/dataQuery/DataQuerySection';
import { toast } from 'sonner';
import { TrendingUp, Users, Building, Leaf } from 'lucide-react';

// Import the components
import CategoriesSection from '@/components/home/CategoriesSection';
import DataVisualizationSection from '@/components/home/DataVisualizationSection';
import ApiDeveloperSection from '@/components/home/ApiDeveloperSection';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visData, setVisData] = useState<any[]>([]);
  
  const location = useLocation();
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  
  // Define categories with appropriate data
  const categories = [
    {
      title: "Economics",
      icon: TrendingUp,
      count: 45,
      description: "Economic indicators, financial data, and market trends"
    },
    {
      title: "Demographics",
      icon: Users,
      count: 32,
      description: "Population statistics, census data, and social metrics"
    },
    {
      title: "Infrastructure",
      icon: Building,
      count: 28,
      description: "Transportation, utilities, and urban development data"
    },
    {
      title: "Environment",
      icon: Leaf,
      count: 38,
      description: "Climate data, environmental monitoring, and sustainability metrics"
    }
  ];
  
  const fetchData = useCallback(async () => {
    try {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with Search Feature */}
        <section className="relative mb-20">
          <Hero onSearch={handleSearch} />
        </section>
        
        {/* Data Query Section - Results area */}
        {activeQuery && (
          <section className="mb-20">
            <DataQuerySection initialQuery={activeQuery} />
          </section>
        )}
        
        {/* Data Visualization Overview - Show capabilities */}
        {!activeQuery && isLoaded && visData.length > 0 && (
          <section className="py-24 bg-muted/10">
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
          <section className="py-24 bg-background">
            <div className="container mx-auto max-w-7xl px-6">
              <CategoriesSection 
                isLoaded={isLoaded} 
                categories={categories}
              />
            </div>
          </section>
        )}
        
        {/* API & Developer Tools */}
        {!activeQuery && (
          <section className="py-24 bg-muted/10">
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
