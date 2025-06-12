
import { useState } from 'react';

export const useCorrelationState = () => {
  const [isAnalyzingCorrelation, setIsAnalyzingCorrelation] = useState(false);
  const [correlationValue, setCorrelationValue] = useState<number | null>(null);

  const handleAnalyzeCorrelation = (variable1: string, variable2: string) => {
    setIsAnalyzingCorrelation(true);
    setCorrelationValue(null);
    
    setTimeout(() => {
      const correlation = (Math.random() * 1.4 - 0.2).toFixed(2);
      setCorrelationValue(parseFloat(correlation));
      setIsAnalyzingCorrelation(false);
    }, 1500);
  };

  return {
    isAnalyzingCorrelation,
    correlationValue,
    handleAnalyzeCorrelation
  };
};
