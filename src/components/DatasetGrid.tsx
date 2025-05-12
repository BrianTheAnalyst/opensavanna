
import React, { useState, useEffect } from 'react';
import DatasetCard from './DatasetCard';

interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number;
  featured?: boolean;
}

interface DatasetGridProps {
  datasets: Dataset[];
  loading?: boolean;
  layout?: 'grid' | 'featured' | 'compact';
  columns?: number;
  onDataChange?: () => void;
}

const DatasetGrid = ({ 
  datasets = [], 
  loading = false,
  layout = 'grid',
  columns = 3,
  onDataChange
}: DatasetGridProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add a key to force re-render
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle dataset deletion and refresh
  const handleDeleteDataset = () => {
    console.log("Dataset deleted, refreshing grid");
    // Trigger refresh in two ways:
    // 1. Call the parent's onDataChange if provided
    if (onDataChange) {
      onDataChange();
    }
    // 2. Update local refresh key to force re-render
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  if (loading) {
    return (
      <div className={`grid gap-6 ${
        columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 
        columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 
        'grid-cols-1'
      }`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="glass border border-border/50 rounded-xl p-5 animate-pulse"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="h-6 bg-muted rounded-full w-24"></div>
              <div className="h-4 bg-muted rounded-full w-16"></div>
            </div>
            <div className="h-6 bg-muted rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-muted rounded w-full mb-1"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded-full w-20"></div>
              <div className="h-4 bg-muted rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (layout === 'featured') {
    const featuredDataset = datasets.find(d => d.featured) || datasets[0];
    const otherDatasets = datasets.filter(d => d !== featuredDataset).slice(0, 3);
    
    return (
      <div key={refreshKey} className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="lg:col-span-2">
          {featuredDataset && (
            <DatasetCard
              id={featuredDataset.id}
              title={featuredDataset.title}
              description={featuredDataset.description}
              category={featuredDataset.category}
              format={featuredDataset.format}
              country={featuredDataset.country}
              date={featuredDataset.date}
              downloads={featuredDataset.downloads}
              type="featured"
              onDelete={handleDeleteDataset}
            />
          )}
        </div>
        <div className="space-y-6">
          {otherDatasets.map((dataset, index) => (
            <DatasetCard
              key={dataset.id}
              id={dataset.id}
              title={dataset.title}
              description={dataset.description}
              category={dataset.category}
              format={dataset.format}
              country={dataset.country}
              date={dataset.date}
              downloads={dataset.downloads}
              type="default"
              onDelete={handleDeleteDataset}
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (layout === 'compact') {
    return (
      <div key={refreshKey} className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {datasets.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            id={dataset.id}
            title={dataset.title}
            description={dataset.description}
            category={dataset.category}
            format={dataset.format}
            country={dataset.country}
            date={dataset.date}
            downloads={dataset.downloads}
            type="compact"
            onDelete={handleDeleteDataset}
          />
        ))}
      </div>
    );
  }
  
  // Default grid layout
  return (
    <div key={refreshKey} className={`grid gap-6 ${
      columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 
      columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
      columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 
      'grid-cols-1'
    } ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {datasets.map((dataset) => (
        <DatasetCard
          key={dataset.id}
          id={dataset.id}
          title={dataset.title}
          description={dataset.description}
          category={dataset.category}
          format={dataset.format}
          country={dataset.country}
          date={dataset.date}
          downloads={dataset.downloads}
          type="default"
          onDelete={handleDeleteDataset}
        />
      ))}
    </div>
  );
};

export default DatasetGrid;
