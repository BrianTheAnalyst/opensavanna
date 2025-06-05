
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import QuerySearchBar from './dataQuery/QuerySearchBar';
import { getSuggestedQuestions } from '@/services/dataInsights/suggestedQueries';
import BackgroundElements from './hero/BackgroundElements';

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  
  useEffect(() => {
    setIsLoaded(true);
    
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
    onSearch(query);
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden py-16">
      <BackgroundElements />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Ask Questions, Get <span className="text-primary">Data-Driven</span> Answers
          </h1>
          <p className={`text-xl text-foreground/80 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Use natural language to explore our datasets. Ask questions about economics, health, 
            education and more to get visualized insights and comparisons.
          </p>
          
          <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Card className="bg-card/95 backdrop-blur border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <QuerySearchBar
                  onSearch={handleSearch}
                  isSearching={false}
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
