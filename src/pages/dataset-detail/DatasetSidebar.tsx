
import React from 'react';

import DatasetSidebarInfo from '@/components/dataset/DatasetSidebarInfo';
import { Dataset } from '@/types/dataset';

interface DatasetSidebarProps {
  dataset: Dataset;
}

const DatasetSidebar = ({ dataset }: DatasetSidebarProps) => {
  return <DatasetSidebarInfo dataset={dataset} />;
};

export default DatasetSidebar;
