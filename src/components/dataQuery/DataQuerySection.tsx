
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataInsightResult, processDataQuery } from '@/services/dataInsightsService';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
    
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    toast.info('Exploring: ' + question);
  };
  
  const handleToggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const handleBackToHome = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('query');
    window.history.pushState({}, '', url);
    window.location.reload();
  };
  
  return (
    <section id="search-section" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToHome}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-4xl font-bold mb-3">Data Analysis Results</h1>
              <p className="text-xl text-muted-foreground">Intelligent insights from your data query</p>
            </div>
          </div>
          
          <Button 
            onClick={handleToggleHistory}
            variant="outline"
            className="px-6 py-3"
          >
            {showHistory ? "Hide History" : "View Search History"}
          </Button>
        </div>
        
        {/* History Section */}
        {showHistory && (
          <div className="mb-16">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-8">
                <VisualHistory onHistoryItemClick={handleSearch} />
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Loading State */}
        {isSearching && (
          <Card className="border-border/50 shadow-xl">
            <CardContent className="py-16 px-8">
              <div className="space-y-8 animate-pulse">
                <div className="text-center space-y-4">
                  <div className="h-8 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg w-1/2 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-64 bg-gradient-to-br from-muted to-muted/60 rounded-xl"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-64 bg-gradient-to-br from-muted to-muted/60 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isSearching && (
          <div className="max-w-3xl mx-auto">
            <Alert variant="destructive" className="border-destructive/50 shadow-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg">Analysis Error</AlertTitle>
              <AlertDescription className="text-base mt-2">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results */}
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
