
import { useState, useEffect } from 'react';
import HeroHeader from './hero/HeroHeader';
import HeroStats from './hero/HeroStats';
import FeaturedDatasetCard from './hero/FeaturedDatasetCard';
import BackgroundElements from './hero/BackgroundElements';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundElements />
      
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Hero header with title, text, and CTA buttons */}
            <HeroHeader isLoaded={isLoaded} />
            
            {/* Stats section */}
            <HeroStats isLoaded={isLoaded} />
          </div>
          
          {/* Featured dataset card with floating elements */}
          <FeaturedDatasetCard isLoaded={isLoaded} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
