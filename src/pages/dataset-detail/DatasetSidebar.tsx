
import { Dataset } from '@/types/dataset';
import DatasetDetails from './DatasetDetails';
import { Button } from "@/components/ui/button";
import { Download, BarChart3, FileText } from 'lucide-react';

interface DatasetSidebarProps {
  dataset: Dataset;
}

const DatasetSidebar = ({ dataset }: DatasetSidebarProps) => {
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
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <BarChart3 className="h-4 w-4 mr-2 text-primary" />
            <span>Visualization tools available</span>
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

export default DatasetSidebar;
