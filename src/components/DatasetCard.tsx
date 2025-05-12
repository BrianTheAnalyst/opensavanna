
import { useState } from 'react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { getFormatIcons } from './dataset/cards/formatIcons';
import CompactDatasetCard from './dataset/cards/CompactDatasetCard';
import FeaturedDatasetCard from './dataset/cards/FeaturedDatasetCard';
import DefaultDatasetCard from './dataset/cards/DefaultDatasetCard';
import { BaseDatasetCardProps } from './dataset/cards/DatasetCardTypes';
import DatasetDeleteButton from './dataset/DatasetDeleteButton';

interface DatasetCardProps extends BaseDatasetCardProps {
  type: 'default' | 'featured' | 'compact';
}

const DatasetCard = ({ 
  id, 
  title, 
  description, 
  category, 
  format, 
  country, 
  date, 
  downloads, 
  type = 'default',
  onDelete
}: DatasetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAdmin } = useIsAdmin();
  
  const formatIcons = getFormatIcons();
  
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    console.log(`Downloading dataset: ${id}`);
    // Add download logic here
  };
  
  // Render the appropriate card component based on type
  if (type === 'compact') {
    return (
      <CompactDatasetCard
        id={id}
        title={title}
        description={description}
        category={category}
        format={format}
        country={country}
        date={date}
        downloads={downloads}
        formatIcons={formatIcons}
        isAdmin={isAdmin}
        onDelete={onDelete}
      />
    );
  }
  
  if (type === 'featured') {
    return (
      <FeaturedDatasetCard
        id={id}
        title={title}
        description={description}
        category={category}
        format={format}
        country={country}
        date={date}
        downloads={downloads}
        formatIcons={formatIcons}
        isAdmin={isAdmin}
        handleDownload={handleDownload}
        isHovered={isHovered}
        onDelete={onDelete}
      />
    );
  }
  
  // Default card type
  return (
    <DefaultDatasetCard
      id={id}
      title={title}
      description={description}
      category={category}
      format={format}
      country={country}
      date={date}
      downloads={downloads}
      formatIcons={formatIcons}
      isAdmin={isAdmin}
      isHovered={isHovered}
      onDelete={onDelete}
    />
  );
};

export default DatasetCard;
