
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Map, FileText, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Category {
  title: string;
  icon: React.ElementType;
  count: number;
  description: string;
}

interface CategoriesSectionProps {
  isLoaded: boolean;
  categories: Category[];
}

const CategoriesSection = ({ isLoaded, categories }: CategoriesSectionProps) => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Browse by Category
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-4">
            Explore Data Categories
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto">
            Discover datasets organized by category to find exactly what you need for your research, applications, or analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link 
                key={category.title} 
                to={`/datasets?category=${category.title.toLowerCase()}`}
                className={`glass border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 transform ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{category.title}</h3>
                    <p className="text-foreground/60 text-sm">
                      {category.count} datasets
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Explore Category
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/datasets">
            <Button variant="outline" className="rounded-full">
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
