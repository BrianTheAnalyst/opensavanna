
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface QuerySearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  suggestedQuestions?: string[];
  className?: string;
}

const QuerySearchBar = ({ onSearch, isSearching, suggestedQuestions = [], className }: QuerySearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Focus on the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Reset selected suggestion when suggestions change or hide
  useEffect(() => {
    if (!showSuggestions || suggestedQuestions.length === 0) {
      setSelectedSuggestionIndex(-1);
    }
  }, [showSuggestions, suggestedQuestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      onSearch(trimmedQuery);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    } else {
      // Handle empty search - trigger a callback for showing suggestions
      onSearch(''); // This will trigger the empty search handling in parent
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only handle keyboard navigation when suggestions are visible
    if (!showSuggestions || suggestedQuestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestedQuestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestedQuestions.length - 1
        );
        break;
      case 'Enter':
        // If a suggestion is selected, use that instead of the input value
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedSuggestion = suggestedQuestions[selectedSuggestionIndex];
          handleSuggestionClick(selectedSuggestion);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex]);

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
            onChange={(e) => { setQuery(e.target.value); }}
            onFocus={() => { setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => { setShowSuggestions(false); }, 200)}
            onKeyDown={handleKeyDown}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button 
            type="submit" 
            disabled={isSearching} 
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
              className="absolute z-50 mt-2 w-full bg-background rounded-lg shadow-lg border border-border/50"
            >
              <div className="py-2">
                <p className="px-4 py-1 text-sm font-medium text-primary">Suggested questions:</p>
                <ul ref={suggestionsRef} className="max-h-64 overflow-y-auto">
                  {suggestedQuestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => { handleSuggestionClick(suggestion); }}
                        className={`w-full px-4 py-2 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none ${
                          index === selectedSuggestionIndex ? 'bg-muted' : ''
                        }`}
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
