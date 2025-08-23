
import { ArrowRight, Database } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";


interface ApiDeveloperSectionProps {
  isLoaded: boolean;
}

const ApiDeveloperSection = ({ isLoaded }: ApiDeveloperSectionProps) => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`glass border border-border/50 rounded-xl overflow-hidden transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="p-6">
              <div className="font-mono text-sm text-foreground/80 bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  <code>{`// Sample API call to fetch datasets
fetch('https://api.opendata.org/v1/datasets')
  .then(response => response.json())
  .then(data => {
    console.log('Total datasets:', data.count);
    console.log('Results:', data.results);
  })
  .catch(error => console.error(error));`}</code>
                </pre>
              </div>
            </div>
            <div className="border-t border-border/50 p-4 bg-muted/30 flex justify-between items-center">
              <div className="text-sm text-foreground/60">api.opendata.org/v1/datasets</div>
              <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">GET</div>
            </div>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
              Developer Tools
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-4">
              Powerful API Access
            </h2>
            <p className="text-foreground/70 mb-6">
              Integrate our data directly into your applications with our developer-friendly API. Access all datasets programmatically for seamless integration.
            </p>
            <ul className="space-y-3 mb-8">
              {['RESTful API endpoints', 'Comprehensive documentation', 'Authentication & rate limiting', 'Webhook notifications'].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/api">
              <Button className="rounded-full group">
                <span>View API Documentation</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiDeveloperSection;
