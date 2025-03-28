
import { Link } from 'react-router-dom';
import DatasetGrid from '@/components/DatasetGrid';
import { Dataset } from '@/types/dataset';

interface RelatedDatasetsProps {
  category?: string;
}

const RelatedDatasets = ({ category }: RelatedDatasetsProps) => {
  const relatedDatasets = [
    {
      id: '2',
      title: 'Trade Patterns & Exports',
      description: 'Analysis of trade patterns, export volumes, and international trade relationships.',
      category: 'Economics',
      format: 'CSV',
      country: 'Africa',
      date: 'Updated May 2023',
      downloads: 2548
    },
    {
      id: '3',
      title: 'Inflation Rates Time Series',
      description: 'Historical data on inflation rates across different regions over time.',
      category: 'Economics',
      format: 'JSON',
      country: 'Global',
      date: 'Updated April 2023',
      downloads: 1987
    },
    {
      id: '4',
      title: 'Economic Development Indicators',
      description: 'Indicators of economic development including infrastructure and investment metrics.',
      category: 'Economics',
      format: 'CSV',
      country: 'Africa',
      date: 'Updated March 2023',
      downloads: 1735
    }
  ];

  return (
    <div className="mt-12 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-medium">Related Datasets</h2>
        <Link to={`/datasets?category=${category}`} className="text-primary hover:underline text-sm">
          View More
        </Link>
      </div>
      
      <DatasetGrid 
        datasets={relatedDatasets} 
        columns={3}
      />
    </div>
  );
};

export default RelatedDatasets;
