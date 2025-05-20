
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderSectionProps {
  question: string;
  answer: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  question, 
  answer
}) => {
  const [showInsights, setShowInsights] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Query Results</CardTitle>
            <CardDescription className="mt-1">
              Based on your question: <span className="font-medium">{question}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground/90">{answer}</p>
      </CardContent>
    </Card>
  );
};

export default HeaderSection;
