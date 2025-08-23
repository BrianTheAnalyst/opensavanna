
import { Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getConversationContext, clearConversationHistory } from '@/services/dataInsights/conversationContext';


interface VisualHistoryProps {
  onHistoryItemClick?: (question: string) => void;
}

const VisualHistory: React.FC<VisualHistoryProps> = ({ onHistoryItemClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const conversationContext = getConversationContext();
  const history = conversationContext.history;
  const itemsPerPage = 3; // Increased from 1 to show more items per page
  const totalPages = Math.ceil(history.length / itemsPerPage);
  
  // Skip rendering if no history
  if (history.length === 0) {
    return null;
  }
  
  const handleItemClick = (question: string) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(question);
      toast.success("Replaying previous search");
    }
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleClearHistory = () => {
    clearConversationHistory();
    toast.success("Search history cleared");
    // Force a refresh of the component by causing a re-render
    window.location.reload();
  };
  
  // Get current page items
  const startIndex = currentPage * itemsPerPage;
  const displayedItems = history.slice(startIndex, startIndex + itemsPerPage);
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for grouping
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric'
      });
    }
  };
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Recent Searches</h3>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearHistory}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear search history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Group items by date */}
      {(() => {
        const groupedItems = new Map();
        
        displayedItems.forEach(item => {
          const dateString = formatDate(item.timestamp);
          if (!groupedItems.has(dateString)) {
            groupedItems.set(dateString, []);
          }
          groupedItems.get(dateString).push(item);
        });
        
        return Array.from(groupedItems.entries()).map(([date, items]) => (
          <div key={date} className="mb-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">{date}</div>
            <div className="space-y-3">
              {(items as any[]).map((item, index) => (
                <Card key={index} className="border border-border/50 hover:border-border transition-colors duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {item.question}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatTime(item.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.answer}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => { handleItemClick(item.question); }}
                    >
                      View Results Again
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-muted-foreground">
                        {item.visualizations?.length || 0} charts
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ));
      })()}
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisualHistory;
