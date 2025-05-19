
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Map, PieChart, LineChart, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';

interface ExampleQuery {
  question: string;
  description: string;
  icon: React.ElementType;
  category: string;
  background: string;
  details?: string;
}

const exampleQueries: ExampleQuery[] = [
  {
    question: "How has economic growth changed across African regions?",
    description: "Compare GDP growth rates and economic indicators across different regions of Africa",
    icon: BarChart,
    category: "Economics",
    background: "bg-blue-50 dark:bg-blue-900/20",
    details: "This query analyzes historical GDP data, growth trends, and economic indicators to show how different African regions have developed economically over time. Results include comparative charts and key insights about economic performance."
  },
  {
    question: "What is the distribution of healthcare facilities by country?",
    description: "Visualize healthcare access and availability across different countries",
    icon: Map,
    category: "Health",
    background: "bg-red-50 dark:bg-red-900/20",
    details: "This query maps healthcare facilities density per population, showing geographic distribution, accessibility gaps, and comparative analysis of healthcare infrastructure across different nations."
  },
  {
    question: "Show me the education enrollment trends over time",
    description: "See how school enrollment has changed over the years across different education levels",
    icon: LineChart,
    category: "Education",
    background: "bg-green-50 dark:bg-green-900/20",
    details: "This query displays enrollment rates across primary, secondary, and tertiary education levels over decades, highlighting gender differences, regional variations, and key policy impacts on educational access."
  },
  {
    question: "What is the modal share of different transport types?",
    description: "View the distribution of transportation methods used across urban centers",
    icon: PieChart,
    category: "Transport",
    background: "bg-amber-50 dark:bg-amber-900/20",
    details: "This query breaks down transportation usage by type (public transit, private vehicles, bicycles, etc.) across major urban centers, showing trends in sustainable transport adoption and infrastructure impacts."
  }
];

interface ExampleQueriesSectionProps {
  onQuerySelect: (query: string) => void;
}

const ExampleQueriesSection: React.FC<ExampleQueriesSectionProps> = ({ onQuerySelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<number[]>([]);
  
  const toggleItem = (index: number) => {
    setOpenItems(current => 
      current.includes(index) 
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Example Questions to Explore</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Try these sample questions or create your own to discover insights from our datasets
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {exampleQueries.map((query, index) => {
            const Icon = query.icon;
            const isOpen = openItems.includes(index);
            
            return (
              <Collapsible
                key={index}
                open={isOpen}
                onOpenChange={() => toggleItem(index)}
                className="col-span-1"
              >
                <Card 
                  className={`transition-all duration-300 ${hoveredIndex === index ? 'transform scale-[1.02] shadow-lg' : ''} hover:border-primary/50 h-full flex flex-col`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <CardHeader className={`${query.background} border-b relative`}>
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-full bg-background/80 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/80">
                        {query.category}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4 flex-grow">
                    <CardTitle className="text-base">{query.question}</CardTitle>
                    <CardDescription className="mt-2">{query.description}</CardDescription>
                  </CardContent>
                  
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-sm text-muted-foreground hover:text-foreground px-6 py-2 border-t group"
                    >
                      <span>{isOpen ? "Show less" : "Learn more"}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-6 py-3 bg-muted/30 text-sm">
                      {query.details}
                    </div>
                  </CollapsibleContent>
                  
                  <CardFooter className="pt-3">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start group hover:text-primary"
                      onClick={() => onQuerySelect(query.question)}
                    >
                      <span>Explore this question</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExampleQueriesSection;
