
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataInsightResult, processDataQuery } from '@/services/dataInsightsService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DataInsightsResult from './DataInsightsResult';
import VisualHistory from './VisualHistory';
import { toast } from 'sonner';

interface DataQuerySectionProps {
  initialQuery?: string;
}

const DataQuerySection = ({ initialQuery }: DataQuerySectionProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DataInsightResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setError(null);
    setShowHistory(false);
    
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
    handleSearch(question);
    
    // Smooth scroll to search section
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    toast.info('Exploring: ' + question);
  };
  
  const handleToggleHistory = () => {
    setShowHistory(prev => !prev);
  };
  
  return (
    <section id="search-section" className="py-16 px-6 border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Data Analysis</h2>
            <p className="text-muted-foreground">Ask questions about our datasets and get intelligent insights</p>
          </div>
          <button 
            onClick={handleToggleHistory}
            className="text-sm text-primary hover:underline flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
          >
            {showHistory ? "Hide History" : "View Search History"}
          </button>
        </div>
        
        {showHistory && (
          <div className="mb-12">
            <VisualHistory onHistoryItemClick={handleSearch} />
          </div>
        )}
        
        {isSearching && (
          <Card className="max-w-5xl mx-auto animate-pulse border-border/50">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && !isSearching && (
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {result && !isSearching && (
          <div className="animate-fade-in">
            <DataInsightsResult 
              result={result} 
              onFollowUpClick={handleFollowUpClick} 
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default DataQuerySection;
