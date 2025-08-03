import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Lightbulb, BarChart, Map, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface NoResultsPlaceholderProps {
  isEmptySearch?: boolean;
  searchQuery?: string;
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    text: "population trends in Africa",
    icon: TrendingUp,
    category: "Demographics"
  },
  {
    text: "climate change impacts in Kenya",
    icon: Map,
    category: "Environment"
  },
  {
    text: "economic growth across regions",
    icon: BarChart,
    category: "Economics"
  },
  {
    text: "healthcare access by country",
    icon: Map,
    category: "Health"
  },
  {
    text: "education enrollment trends",
    icon: TrendingUp,
    category: "Education"
  },
  {
    text: "transportation modal share",
    icon: BarChart,
    category: "Transport"
  }
];

const NoResultsPlaceholder: React.FC<NoResultsPlaceholderProps> = ({ 
  isEmptySearch = false, 
  searchQuery = "",
  onSuggestionClick 
}) => {
  const title = isEmptySearch 
    ? "Start exploring our datasets" 
    : "No results found";
    
  const description = isEmptySearch
    ? "Try one of these popular searches to discover insights from our data"
    : `No datasets found for "${searchQuery}". Try one of these suggestions instead:`;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="pt-8 pb-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {isEmptySearch ? (
              <Lightbulb className="h-12 w-12 text-primary/60" />
            ) : (
              <Search className="h-12 w-12 text-muted-foreground/60" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start hover:border-primary/50 hover:bg-primary/5 group"
                  onClick={() => onSuggestionClick(suggestion.text)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-primary transition-colors">
                        {suggestion.text}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {suggestion.category}
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Try asking questions like <em>"What are the trends in..."</em> or <em>"Compare ... across regions"</em>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoResultsPlaceholder;