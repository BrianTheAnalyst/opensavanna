
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import QuerySearchBar from './dataQuery/QuerySearchBar';
import { getSuggestedQuestions } from '@/services/dataInsightsService';
import BackgroundElements from './hero/BackgroundElements';

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
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
    // Call the parent search handler
    onSearch(query);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-16 pb-8">
      {/* Background decorative elements */}
      <BackgroundElements />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Explore Africa's Data, <span className="text-primary">Discover Insights</span>
          </h1>
          <p className={`text-xl text-foreground/80 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Transform complex datasets into actionable intelligence. Use natural language to explore 
            economics, health, education, and development data across Africa.
          </p>
          
          <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Card className="bg-card/95 backdrop-blur border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <QuerySearchBar
                  onSearch={handleSearch}
                  isSearching={isSearching}
                  suggestedQuestions={suggestedQuestions}
                  className="max-w-3xl mx-auto"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
