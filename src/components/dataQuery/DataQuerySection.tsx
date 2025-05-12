
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import QuerySearchBar from './QuerySearchBar';
import DataInsightsResult from './DataInsightsResult';
import { DataInsightResult, getSuggestedQuestions, processDataQuery } from '@/services/dataInsightsService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DataQuerySection = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DataInsightResult | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
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

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setError(null);
    try {
      const data = await processDataQuery(query);
      setResult(data);
      // Update the URL to include the query parameter
      const url = new URL(window.location.href);
      url.searchParams.set('query', query);
      window.history.pushState({}, '', url);
    } catch (err: any) {
      setError(err.message || 'Failed to process your question');
      toast.error('Failed to process your question');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ask Questions, Get Data-Driven Answers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Use natural language to explore our datasets. Ask questions about economics, health, 
            education and more to get visualized insights and comparisons.
          </p>
          <QuerySearchBar
            onSearch={handleSearch}
            isSearching={isSearching}
            suggestedQuestions={suggestedQuestions}
            className="max-w-2xl mx-auto"
          />
        </div>

        {isSearching && (
          <Card className="max-w-4xl mx-auto animate-pulse">
            <CardContent className="pt-6">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && !isSearching && (
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && !isSearching && <DataInsightsResult result={result} />}
      </div>
    </section>
  );
};

export default DataQuerySection;
