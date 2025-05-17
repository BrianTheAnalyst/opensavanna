
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart2, Layers, Workflow } from 'lucide-react';

interface CorrelationPanelProps {
  availableVariables: { id: string; name: string; category: string }[];
  onAnalyze: (var1: string, var2: string) => void;
  correlationValue?: number | null;
  isAnalyzing?: boolean;
}

const CorrelationPanel: React.FC<CorrelationPanelProps> = ({
  availableVariables,
  onAnalyze,
  correlationValue = null,
  isAnalyzing = false
}) => {
  const [variable1, setVariable1] = useState<string>('');
  const [variable2, setVariable2] = useState<string>('');

  // Group variables by category for better organization
  const categorizedVariables = availableVariables.reduce((acc: Record<string, typeof availableVariables>, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {});

  // Handle analyze button click
  const handleAnalyze = () => {
    if (variable1 && variable2 && variable1 !== variable2) {
      onAnalyze(variable1, variable2);
    }
  };

  // Format correlation value as string with sign
  const formatCorrelation = (value: number): string => {
    if (value === 0) return "0 (No correlation)";
    
    const sign = value > 0 ? "+" : "";
    const description = value > 0 ? "Positive" : "Negative";
    const strength = 
      Math.abs(value) > 0.7 ? "Strong" :
      Math.abs(value) > 0.4 ? "Moderate" :
      "Weak";
      
    return `${sign}${value.toFixed(2)} (${strength} ${description})`;
  };

  // Get correlation badge color based on value
  const getCorrelationBadgeColor = (value: number | null): string => {
    if (value === null) return "bg-gray-500";
    if (Math.abs(value) > 0.7) return value > 0 ? "bg-green-500" : "bg-red-500";
    if (Math.abs(value) > 0.4) return value > 0 ? "bg-green-400" : "bg-red-400";
    return "bg-gray-400";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Workflow className="h-4 w-4 mr-2" />
          Variable Correlation Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-4">
          {/* First variable selector */}
          <Select value={variable1} onValueChange={setVariable1}>
            <SelectTrigger>
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categorizedVariables).map(([category, vars]) => (
                <React.Fragment key={category}>
                  <div className="text-xs text-muted-foreground px-2 py-1">{category}</div>
                  {vars.map(variable => (
                    <SelectItem key={variable.id} value={variable.id}>
                      {variable.name}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>

          {/* Arrow connecting the variables */}
          <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />

          {/* Second variable selector */}
          <Select value={variable2} onValueChange={setVariable2}>
            <SelectTrigger>
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categorizedVariables).map(([category, vars]) => (
                <React.Fragment key={category}>
                  <div className="text-xs text-muted-foreground px-2 py-1">{category}</div>
                  {vars.map(variable => (
                    <SelectItem key={variable.id} value={variable.id} disabled={variable.id === variable1}>
                      {variable.name}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Analyze button */}
        <Button 
          onClick={handleAnalyze} 
          disabled={!variable1 || !variable2 || variable1 === variable2 || isAnalyzing}
          className="w-full mb-4"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Correlation"}
        </Button>

        {/* Correlation result */}
        {correlationValue !== null && (
          <div className="border rounded-md p-3 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Correlation Result:</span>
              <Badge className={getCorrelationBadgeColor(correlationValue)}>
                {formatCorrelation(correlationValue)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.abs(correlationValue) > 0.7 ? 
                "Strong correlation indicates a significant relationship between variables." :
                Math.abs(correlationValue) > 0.4 ?
                  "Moderate correlation suggests a relationship exists but other factors may be involved." :
                  "Weak correlation suggests these variables have limited relationship."
              }
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="text-xs">
            <BarChart2 className="h-3 w-3 mr-1" />
            Visualize
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Layers className="h-3 w-3 mr-1" />
            Show as Layer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationPanel;
