
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionCategory } from '@/services/dataInsights/followUpQuestions';

interface FollowUpQuestionsProps {
  categories: QuestionCategory[];
  onQuestionClick: (question: string) => void;
}

const FollowUpQuestions = ({ categories, onQuestionClick }: FollowUpQuestionsProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  if (!categories.length) return null;

  const toggleCategory = (categoryType: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryType)) {
      newExpanded.delete(categoryType);
    } else {
      newExpanded.add(categoryType);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Explore Further</h3>
          <p className="text-sm text-muted-foreground">
            Continue your data exploration with these targeted questions
          </p>
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.type);
            const displayQuestions = isExpanded ? category.questions : category.questions.slice(0, 1);
            
            return (
              <div key={category.type} className="border border-border/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.label}
                    </Badge>
                  </div>
                  
                  {category.questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { toggleCategory(category.type); }}
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {displayQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3 border-primary/20 hover:border-primary hover:bg-primary/5"
                      onClick={() => { onQuestionClick(question); }}
                    >
                      <span className="text-sm">{question}</span>
                    </Button>
                  ))}
                </div>
                
                {!isExpanded && category.questions.length > 1 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{category.questions.length - 1} more question{category.questions.length > 2 ? 's' : ''}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowUpQuestions;
