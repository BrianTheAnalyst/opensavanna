
import { Dataset } from '@/types/dataset';
import DatasetDetails from './DatasetDetails';

interface DatasetSidebarProps {
  dataset: Dataset;
}

const DatasetSidebar = ({ dataset }: DatasetSidebarProps) => {
  const defaultTags = ['economics', 'data', 'statistics'];
  
  return <DatasetDetails dataset={dataset} defaultTags={defaultTags} />;
};

export default DatasetSidebar;
