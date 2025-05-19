
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import QuerySearchBar from './dataQuery/QuerySearchBar';
import { getSuggestedQuestions } from '@/services/dataInsightsService';
import BackgroundElements from './hero/BackgroundElements';
import HeroStats from './hero/HeroStats';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Load suggested questions when the component mounts
    const loadSuggestions = async () => {
      try {
        const questions = await getSuggestedQuestions();
        setSuggestedQuestions(questions);
      } catch (error) {
        console.error('Error loading suggested questions:', error);
      }
    };

    loadSuggestions();
  }, []);

  const handleSearch = (query: string) => {
    // Update the URL to include the query parameter and scroll to search section
    const url = new URL(window.location.href);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url);
    
    // Scroll to search results section
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-16 pb-8">
      {/* Background decorative elements */}
      <BackgroundElements />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Ask Questions, Get <span className="text-primary">Data-Driven</span> Answers
          </h1>
          <p className={`text-xl text-foreground/80 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Use natural language to explore our datasets. Ask questions about economics, health, 
            education and more to get visualized insights and comparisons.
          </p>
          
          <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Card className="bg-card/95 backdrop-blur border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-2">
              <div className="p-6">
                <QuerySearchBar
                  onSearch={handleSearch}
                  isSearching={isSearching}
                  suggestedQuestions={suggestedQuestions}
                  className="max-w-3xl mx-auto"
                />
              </div>
            </Card>
            
            {/* Added space between search bar and stats */}
            <div className="h-4"></div>
          </div>
        </div>
        
        {/* Stats section with additional spacing */}
        <div className="mt-16">
          <HeroStats isLoaded={isLoaded} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
