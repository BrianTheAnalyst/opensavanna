
import { BadgeCheck, ArrowRightLeft, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface CorrelationPanelProps {
  variables: Array<{ id: string; name: string; category?: string }>;
  onAnalyze: (variable1: string, variable2: string) => void;
  correlationValue: number | null;
  isAnalyzing: boolean;
}

const CorrelationPanel: React.FC<CorrelationPanelProps> = ({
  variables,
  onAnalyze,
  correlationValue,
  isAnalyzing
}) => {
  const [variable1, setVariable1] = useState('');
  const [variable2, setVariable2] = useState('');
  
  const handleAnalyze = () => {
    if (variable1 && variable2) {
      onAnalyze(variable1, variable2);
    }
  };

  const getCorrelationStrength = () => {
    if (correlationValue === null) return '';
    
    const absValue = Math.abs(correlationValue);
    if (absValue < 0.3) return 'Weak';
    if (absValue < 0.7) return 'Moderate';
    return 'Strong';
  };
  
  const getCorrelationColor = () => {
    if (correlationValue === null) return 'bg-gray-300';
    
    const absValue = Math.abs(correlationValue);
    if (absValue < 0.3) return 'bg-yellow-500';
    if (absValue < 0.7) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <ArrowRightLeft className="h-4 w-4 mr-2 text-primary" />
          Correlation Analysis
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="variable1">
            First Variable
          </label>
          <Select value={variable1} onValueChange={setVariable1}>
            <SelectTrigger id="variable1" className="w-full">
              <SelectValue placeholder="Select a variable" />
            </SelectTrigger>
            <SelectContent>
              <div className="max-h-[200px] overflow-auto">
                {variables.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="variable2">
            Second Variable
          </label>
          <Select value={variable2} onValueChange={setVariable2}>
            <SelectTrigger id="variable2" className="w-full">
              <SelectValue placeholder="Select a variable" />
            </SelectTrigger>
            <SelectContent>
              <div className="max-h-[200px] overflow-auto">
                {variables.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAnalyze} 
          className="w-full"
          disabled={isAnalyzing || !variable1 || !variable2}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Correlation'
          )}
        </Button>

        {correlationValue !== null && !isAnalyzing && (
          <div className="mt-4 space-y-2 animate-fade-in border border-border/40 rounded-md p-3 bg-card/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Correlation Coefficient</span>
              <span className="text-sm font-bold">{correlationValue.toFixed(2)}</span>
            </div>
            <Progress value={(Math.abs(correlationValue) * 100)} className={getCorrelationColor()} />
            <div className="flex items-center mt-1">
              <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-xs">
                {getCorrelationStrength()} {correlationValue >= 0 ? 'positive' : 'negative'} correlation
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md border border-border/40">
          <p>Correlation analysis helps identify relationships between different variables in your data.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationPanel;
