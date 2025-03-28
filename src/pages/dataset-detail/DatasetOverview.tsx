
import { Dataset } from '@/types/dataset';
import Visualization from '@/components/Visualization';
import { sampleVisData } from '@/services';

interface DatasetOverviewProps {
  dataset: Dataset;
}

const DatasetOverview = ({ dataset }: DatasetOverviewProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">About This Dataset</h2>
          <p className="text-foreground/70 mb-4">
            This comprehensive dataset provides economic indicators for various regions, offering valuable insights for researchers, policymakers, and analysts. The data covers GDP, inflation rates, unemployment statistics, and trade balances over a 13-year period.
          </p>
          <p className="text-foreground/70 mb-4">
            The collection methodology follows international standards for economic data collection, ensuring consistency and comparability across regions and time periods. Data points are aggregated quarterly and verified against official government reports.
          </p>
          <p className="text-foreground/70">
            Users can explore economic trends, perform comparative analysis, and identify patterns in regional economic development. This dataset is particularly valuable for understanding economic disparities and growth trajectories.
          </p>
        </div>
        
        <div className="glass border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Sample Visualization</h2>
          <p className="text-foreground/70 mb-4">
            Below is a sample visualization showing regional economic contribution percentages based on the dataset:
          </p>
          <Visualization 
            data={sampleVisData} 
            title="Regional Economic Contribution" 
            description="Percentage contribution to overall GDP by region"
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
