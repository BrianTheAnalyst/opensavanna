
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataInsightResult, processDataQuery } from '@/services/dataInsightsService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DataInsightsResult from './DataInsightsResult';
import { toast } from 'sonner';

interface DataQuerySectionProps {
  initialQuery?: string;
}

const DataQuerySection = ({ initialQuery }: DataQuerySectionProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DataInsightResult | null>(null);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

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

  const handleFollowUpClick = (question: string) => {
    // When a follow-up question is clicked, run the search with that question
    handleSearch(question);
    
    // Scroll to search section
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    toast.info('Exploring: ' + question);
  };
  
  return (
    <section id="search-section" className="py-12 px-4 border-t border-border/40">
      <div className="container mx-auto">
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

        {result && !isSearching && (
          <DataInsightsResult 
            result={result} 
            onFollowUpClick={handleFollowUpClick} 
          />
        )}
      </div>
    </section>
  );
};

export default DataQuerySection;
