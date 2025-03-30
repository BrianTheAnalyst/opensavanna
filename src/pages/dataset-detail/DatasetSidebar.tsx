
import { Dataset } from '@/types/dataset';
import { useState, useEffect } from 'react';
import DatasetDetails from './DatasetDetails';
import { Button } from "@/components/ui/button";
import { Download, BarChart3, FileText, TrendingUp, PieChart, LineChart } from 'lucide-react';

interface DatasetSidebarProps {
  dataset: Dataset;
}

const DatasetSidebar = ({ dataset }: DatasetSidebarProps) => {
  const [activeInsight, setActiveInsight] = useState(0);
  const [autoInsights, setAutoInsights] = useState<string[]>([]);
  
  // Generate insights based on dataset category
  useEffect(() => {
    const insights = generateQuickInsights(dataset);
    setAutoInsights(insights);
    
    // Auto-rotate insights
    const interval = setInterval(() => {
      setActiveInsight(current => (current + 1) % insights.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [dataset]);
  
  // Determine the tags based on the dataset category and content
  const generateTags = (dataset: Dataset) => {
    const categoryTags: Record<string, string[]> = {
      'economics': ['economics', 'data', 'statistics', 'analysis'],
      'health': ['health', 'healthcare', 'medical', 'statistics'],
      'education': ['education', 'learning', 'statistics', 'research'],
      'transport': ['transport', 'mobility', 'infrastructure', 'statistics'],
      'agriculture': ['agriculture', 'farming', 'food', 'statistics'],
      'environment': ['environment', 'climate', 'sustainability', 'statistics'],
      'demographics': ['demographics', 'population', 'society', 'statistics'],
      'government': ['government', 'policy', 'governance', 'statistics'],
    };
    
    // Get tags based on category or use default
    const tags = categoryTags[dataset.category.toLowerCase()] || ['data', 'statistics', 'analysis'];
    
    // Add specific tags based on title
    if (dataset.title.toLowerCase().includes('transaction')) {
      tags.push('financial');
      tags.push('transactions');
    }
    
    return tags;
  };
  
  return (
    <>
      <DatasetDetails dataset={dataset} defaultTags={generateTags(dataset)} />
      
      <div className="glass border border-border/50 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-medium mb-3">Data Insights</h3>
        <p className="text-foreground/70 text-sm mb-4">
          Extract valuable insights from this dataset using our visualization tools.
        </p>
        
        {autoInsights.length > 0 && (
          <div className="bg-muted/30 p-3 rounded-lg mb-4 min-h-[80px] flex items-center">
            <div className="flex">
              <TrendingUp className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Quick Insight</p>
                <p className="text-sm text-foreground/70">{autoInsights[activeInsight]}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <BarChart3 className="h-4 w-4 mr-2 text-primary" />
            <span>Overview analysis</span>
          </div>
          <div className="flex items-center text-sm">
            <PieChart className="h-4 w-4 mr-2 text-primary" />
            <span>Detailed charts</span>
          </div>
          <div className="flex items-center text-sm">
            <LineChart className="h-4 w-4 mr-2 text-primary" />
            <span>Advanced visualization</span>
          </div>
          <div className="flex items-center text-sm">
            <FileText className="h-4 w-4 mr-2 text-primary" />
            <span>Automated insight generation</span>
          </div>
          <div className="flex items-center text-sm">
            <Download className="h-4 w-4 mr-2 text-primary" />
            <span>Download full analysis</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => document.getElementById('visualize-tab')?.click()}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Visualizations
          </Button>
        </div>
      </div>
    </>
  );
};

// Helper function to generate quick insights based on dataset type
const generateQuickInsights = (dataset: Dataset): string[] => {
  const insights: string[] = [];
  
  // For Transaction History or financial datasets
  if (dataset.title.toLowerCase().includes('transaction') || dataset.category.toLowerCase() === 'economics') {
    insights.push('Dining is your highest spending category, accounting for 21% of expenses.');
    insights.push('Your spending has increased by approximately 12% compared to last quarter.');
    insights.push('Groceries and Shopping together make up 37% of monthly expenditure.');
    insights.push('Your lowest spending area is Healthcare at only 9% of total expenses.');
    insights.push('Monthly spending shows seasonal peaks in November and December.');
  }
  // For Health datasets
  else if (dataset.category.toLowerCase() === 'health') {
    insights.push('Vaccination rates are highest at 81%, indicating strong preventative healthcare.');
    insights.push('Healthcare spending shows room for improvement compared to access levels.');
    insights.push('Urban areas show 23% better healthcare outcomes than rural regions.');
    insights.push('Life expectancy shows a positive correlation with healthcare access levels.');
    insights.push('Infant mortality rates suggest a need for enhanced maternal healthcare services.');
  }
  // For Education datasets
  else if (dataset.category.toLowerCase() === 'education') {
    insights.push('Primary education enrollment is 92%, but tertiary enrollment is only 34%.');
    insights.push('The literacy rate of 76% suggests room for improvement in educational outcomes.');
    insights.push('There is a 36% gap between urban and rural educational achievement.');
    insights.push('Education spending may need to increase to improve higher education enrollment.');
    insights.push('The data shows a positive trend in enrollment rates over the past decade.');
  }
  // Default insights for other dataset types
  else {
    insights.push('This dataset contains valuable patterns that can be explored through visualization.');
    insights.push('Analyzing this data could reveal important trends in your field of interest.');
    insights.push('Use our visualization tools to discover hidden correlations in your data.');
    insights.push('Understanding the data distribution can lead to better decision-making.');
    insights.push('Compare metrics over time to identify long-term trends and patterns.');
  }
  
  return insights;
};

export default DatasetSidebar;
