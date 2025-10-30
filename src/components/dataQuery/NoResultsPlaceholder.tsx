import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Lightbulb, BarChart, Map, TrendingUp, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDatasetGuidance, GuidanceResult } from '@/services/dataInsights/datasetGuidance';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NoResultsPlaceholderProps {
  isEmptySearch?: boolean;
  searchQuery?: string;
  onSuggestionClick: (suggestion: string) => void;
}

const getIconForCategory = (category: string) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('econom')) return BarChart;
  if (categoryLower.includes('health')) return TrendingUp;
  if (categoryLower.includes('education')) return TrendingUp;
  if (categoryLower.includes('transport')) return Map;
  if (categoryLower.includes('environment')) return Map;
  return BarChart;
};

const NoResultsPlaceholder: React.FC<NoResultsPlaceholderProps> = ({ 
  isEmptySearch = false, 
  searchQuery = "",
  onSuggestionClick 
}) => {
  const [guidance, setGuidance] = useState<GuidanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGuidance = async () => {
      setIsLoading(true);
      const result = await getDatasetGuidance(searchQuery);
      setGuidance(result);
      setIsLoading(false);
    };
    loadGuidance();
  }, [searchQuery]);

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-8 pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!guidance) return null;

  const title = !guidance.hasDatasets
    ? "No datasets available yet" 
    : isEmptySearch 
      ? "Start exploring our datasets" 
      : "No results found";
    
  const description = !guidance.hasDatasets
    ? "Upload the first dataset to start exploring data insights"
    : isEmptySearch
      ? `Explore ${guidance.totalDatasets} datasets across ${guidance.categories.length} categories`
      : `No datasets found for "${searchQuery}". ${guidance.queryRefinements[0] || 'Try refining your search'}`;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="pt-8 pb-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {!guidance.hasDatasets ? (
              <Upload className="h-12 w-12 text-primary/60" />
            ) : isEmptySearch ? (
              <Lightbulb className="h-12 w-12 text-primary/60" />
            ) : (
              <Search className="h-12 w-12 text-muted-foreground/60" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">{description}</p>
        </div>

        {/* No datasets - encourage upload */}
        {!guidance.hasDatasets && (
          <div className="space-y-4">
            <Alert className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                Be the first to contribute! Upload datasets in categories like Economics, Health, Education, Transport, or Environment to enable data exploration.
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <Link to="/upload">
                <Button size="lg" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Your First Dataset
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Available categories */}
        {guidance.hasDatasets && guidance.categories.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-center">Available Data Categories</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {guidance.categories.map((cat, index) => {
                const Icon = getIconForCategory(cat.category);
                return (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="px-3 py-1.5 gap-2"
                  >
                    <Icon className="h-3 w-3" />
                    {cat.category}
                    <span className="ml-1 text-xs opacity-70">({cat.count})</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Suggested queries */}
        {guidance.suggestedQueries.length > 0 && (
          <>
            <div className="mb-3">
              <h4 className="text-sm font-medium text-center">
                {isEmptySearch ? 'Try These Questions' : 'Suggested Queries'}
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {guidance.suggestedQueries.map((query, index) => {
                const Icon = Lightbulb;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 justify-start hover:border-primary/50 hover:bg-primary/5 group text-left"
                      onClick={() => onSuggestionClick(query)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-primary transition-colors leading-snug">
                            {query}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Query refinement tips for failed searches */}
        {!isEmptySearch && searchQuery && guidance.queryRefinements.length > 1 && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="text-sm font-medium mb-3 text-center">Tips to Improve Your Search</h4>
            <div className="space-y-2">
              {guidance.queryRefinements.slice(1).map((tip, index) => (
                <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing categories - encourage contribution */}
        {guidance.hasDatasets && guidance.missingCategories.length > 0 && guidance.missingCategories.length <= 5 && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Want to see more? We're looking for datasets in: {guidance.missingCategories.join(', ')}
              </p>
              <Link to="/upload">
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-3 w-3" />
                  Contribute a Dataset
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* General help */}
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