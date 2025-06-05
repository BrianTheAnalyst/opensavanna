
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import DataQuerySection from '@/components/dataQuery/DataQuerySection';

const Index = () => {
  const location = useLocation();
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if (query) {
      setActiveQuery(query);
    }
  }, [location]);

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
        <section className="relative">
          <Hero onSearch={handleSearch} />
        </section>
        
        {/* Data Query Section - Results area */}
        {activeQuery && (
          <section id="search-section" className="py-8">
            <div className="container mx-auto max-w-7xl px-6">
              <DataQuerySection initialQuery={activeQuery} />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
