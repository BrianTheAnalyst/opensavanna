
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getConversationContext } from '@/services/dataInsights/conversationContext';

interface VisualHistoryProps {
  onHistoryItemClick?: (question: string) => void;
}

const VisualHistory: React.FC<VisualHistoryProps> = ({ onHistoryItemClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const conversationContext = getConversationContext();
  const history = conversationContext.history;
  const itemsPerPage = 1;
  const totalPages = Math.ceil(history.length / itemsPerPage);
  
  // Skip rendering if no history
  if (history.length === 0) {
    return null;
  }
  
  const handleItemClick = (question: string) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(question);
    }
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };
  
  // Get current page items
  const startIndex = currentPage * itemsPerPage;
  const displayedItems = history.slice(startIndex, startIndex + itemsPerPage);
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Recent Searches</h3>
      </div>
      
      {displayedItems.map((item, index) => (
        <Card key={index} className="mb-4 border border-border/50">
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
          
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleItemClick(item.question)}
            >
              View Results Again
            </Button>
          </CardFooter>
        </Card>
      ))}
      
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
            {currentPage + 1} / {totalPages}
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
