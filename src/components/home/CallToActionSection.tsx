
import { ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="container px-4 mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/20 rounded-full">
          Join the Community
        </div>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 max-w-2xl mx-auto">
          Ready to unlock the power of open data?
        </h2>
        <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
          Start exploring our datasets or contribute your own data to help build a more open and accessible data ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/datasets">
            <Button size="lg" className="rounded-full group">
              <span>Explore Datasets</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/upload">
            <Button size="lg" variant="outline" className="rounded-full">
              <Database className="mr-2 h-4 w-4" />
              Contribute Data
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
