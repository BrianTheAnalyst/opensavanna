
import { useState, useEffect } from 'react';
import DatasetGrid from '@/components/DatasetGrid';
import { getDatasets } from '@/services';
import { Dataset } from '@/types/dataset';

interface RelatedDatasetsProps {
  category: string;
  onDataChange?: () => void; // Add onDataChange prop
}

const RelatedDatasets = ({ category, onDataChange }: RelatedDatasetsProps) => {
  const [relatedDatasets, setRelatedDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRelatedDatasets = async () => {
      setIsLoading(true);
      try {
        // Fetch datasets in the same category
        const allDatasets = await getDatasets({ category });
        // We want to show only 3 related datasets and exclude the current one
        setRelatedDatasets(allDatasets.slice(0, 3));
      } catch (error) {
        console.error('Failed to load related datasets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (category) {
      fetchRelatedDatasets();
    }
  }, [category]);
  
  if (relatedDatasets.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-medium mb-6">Related Datasets</h2>
      <DatasetGrid 
        datasets={relatedDatasets} 
        loading={isLoading} 
        columns={3} 
        onDataChange={onDataChange} 
      />
    </section>
  );
};

export default RelatedDatasets;
