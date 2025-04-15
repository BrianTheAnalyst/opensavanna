
import { Dataset } from '@/types/dataset';
import Visualization from '@/components/Visualization';
import { sampleVisData } from '@/services';
import { Info } from 'lucide-react';

interface DatasetOverviewProps {
  dataset: Dataset;
}

const DatasetOverview = ({ dataset }: DatasetOverviewProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">About This Dataset</h2>
          
          <div className="prose prose-sm max-w-none text-foreground/80 space-y-4">
            <p>
              This comprehensive dataset provides {dataset.category.toLowerCase()} indicators for various regions, 
              offering valuable insights for researchers, policymakers, and analysts.
            </p>
            
            <p>
              The collection methodology follows international standards for data collection, 
              ensuring consistency and comparability across regions and time periods.
              {dataset.dataPoints && 
                ` This dataset contains approximately ${typeof dataset.dataPoints === 'number' 
                  ? dataset.dataPoints.toLocaleString() 
                  : dataset.dataPoints} data points.`
              }
            </p>
            
            <p>
              Users can explore trends, perform comparative analysis, and identify patterns 
              in regional development. This dataset is particularly valuable for understanding 
              disparities and growth trajectories.
            </p>
          </div>
          
          {dataset.description && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="flex items-center mb-3">
                <Info className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium">Detailed Description</h3>
              </div>
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="prose prose-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {dataset.description}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Sample Visualization</h2>
          <p className="text-foreground/70 mb-4">
            Below is a sample visualization based on the dataset:
          </p>
          <Visualization 
            data={sampleVisData} 
            title={`${dataset.title} Overview`}
            description="Visual representation of key data points"
          />
        </div>
      </div>
      
      <DatasetSidebar dataset={dataset} />
    </div>
  );
};

// Importing the DatasetSidebar component in the same file to avoid circular dependencies
import DatasetSidebar from './DatasetSidebar';

export default DatasetOverview;

