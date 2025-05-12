
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Map, PieChart, LineChart } from 'lucide-react';

interface ExampleQuery {
  question: string;
  description: string;
  icon: React.ElementType;
  category: string;
  background: string;
}

const exampleQueries: ExampleQuery[] = [
  {
    question: "How has economic growth changed across African regions?",
    description: "Compare GDP growth rates and economic indicators across different regions of Africa",
    icon: BarChart,
    category: "Economics",
    background: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    question: "What is the distribution of healthcare facilities by country?",
    description: "Visualize healthcare access and availability across different countries",
    icon: Map,
    category: "Health",
    background: "bg-red-50 dark:bg-red-900/20"
  },
  {
    question: "Show me the education enrollment trends over time",
    description: "See how school enrollment has changed over the years across different education levels",
    icon: LineChart,
    category: "Education",
    background: "bg-green-50 dark:bg-green-900/20"
  },
  {
    question: "What is the modal share of different transport types?",
    description: "View the distribution of transportation methods used across urban centers",
    icon: PieChart,
    category: "Transport",
    background: "bg-amber-50 dark:bg-amber-900/20"
  }
];

interface ExampleQueriesSectionProps {
  onQuerySelect: (query: string) => void;
}

const ExampleQueriesSection: React.FC<ExampleQueriesSectionProps> = ({ onQuerySelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Example Questions to Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {exampleQueries.map((query, index) => {
            const Icon = query.icon;
            
            return (
              <Card 
                key={index}
                className={`transition-all duration-300 ${hoveredIndex === index ? 'transform scale-[1.02] shadow-lg' : ''} hover:border-primary/50`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardHeader className={`${query.background} border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-full bg-background/80 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/80">
                      {query.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-base">{query.question}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">{query.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start group"
                    onClick={() => onQuerySelect(query.question)}
                  >
                    <span>Explore this question</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExampleQueriesSection;
