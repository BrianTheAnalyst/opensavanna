
import { useState } from 'react';
import { DataInsightResult } from '@/services/dataInsights/types';
import { generateCategorizedFollowUpQuestions } from '@/services/dataInsights/followUpQuestions';
import HeaderSection from './sections/HeaderSection';
import VisualizationsSection from './sections/VisualizationsSection';
import ComparisonSection from './sections/ComparisonSection';
import DatasetsSection from './sections/DatasetsSection';
import InsightsSection from './sections/InsightsSection';
import FollowUpQuestions from './FollowUpQuestions';

interface DataInsightsResultProps {
  result: DataInsightResult;
  onFollowUpClick?: (question: string) => void;
}

const DataInsightsResult = ({ result, onFollowUpClick }: DataInsightsResultProps) => {
  // States for insights visibility
  const [expandedInsights, setExpandedInsights] = useState(false);
  
  const handleFollowUpClick = (question: string) => {
    if (onFollowUpClick) {
      onFollowUpClick(question);
    }
  };

  // Generate categorized follow-up questions
  const questionCategories = generateCategorizedFollowUpQuestions(result.question, result);
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <HeaderSection
        question={result.question}
        answer={result.answer}
      />
      
      {/* Improved Follow-up Questions */}
      {questionCategories.length > 0 && (
        <FollowUpQuestions 
          categories={questionCategories}
          onQuestionClick={handleFollowUpClick}
        />
      )}
      
      {/* Insights - Now using the dedicated InsightsSection component */}
      <InsightsSection 
        insights={result.insights} 
        expanded={expandedInsights}
        onToggleExpanded={() => setExpandedInsights(!expandedInsights)}
      />
      
      {/* Main visualizations */}
      <VisualizationsSection visualizations={result.visualizations} />
      
      {/* Comparison if available */}
      {result.comparisonResult && (
        <ComparisonSection comparison={result.comparisonResult} />
      )}
      
      {/* Dataset information */}
      <DatasetsSection 
        datasets={result.datasets}
      />
    </div>
  );
};

export default DataInsightsResult;
