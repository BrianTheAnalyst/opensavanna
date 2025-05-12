
import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

interface QuerySearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  suggestedQuestions?: string[];
  className?: string;
}

const QuerySearchBar = ({ onSearch, isSearching, suggestedQuestions = [], className }: QuerySearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask a question about our datasets..."
            className="w-full h-14 pl-12 pr-20 text-lg rounded-full shadow-md focus:ring-2 focus:ring-primary/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button 
            type="submit" 
            disabled={isSearching || !query.trim()} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-10"
          >
            {isSearching ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin" />
            ) : (
              <>
                <span className="mr-1 hidden sm:inline">Search</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <AnimatePresence>
          {showSuggestions && suggestedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-2 w-full bg-background rounded-lg shadow-lg border border-border/50"
            >
              <div className="py-2">
                <p className="px-4 py-1 text-sm text-muted-foreground">Suggested questions:</p>
                <ul>
                  {suggestedQuestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default QuerySearchBar;
