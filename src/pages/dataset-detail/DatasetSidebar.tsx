
import React from 'react';
import { Dataset } from '@/types/dataset';
import DatasetSidebarInfo from '@/components/dataset/DatasetSidebarInfo';

interface DatasetSidebarProps {
  dataset: Dataset;
}

const DatasetSidebar = ({ dataset }: DatasetSidebarProps) => {
  return <DatasetSidebarInfo dataset={dataset} />;
};

export default DatasetSidebar;
