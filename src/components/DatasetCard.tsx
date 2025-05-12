
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { isUserAdmin } from '@/services/userRoleService';
import { deleteDataset } from '@/services/datasetAdminService';
import { getFormatIcons } from './dataset/cards/formatIcons';
import CompactDatasetCard from './dataset/cards/CompactDatasetCard';
import FeaturedDatasetCard from './dataset/cards/FeaturedDatasetCard';
import DefaultDatasetCard from './dataset/cards/DefaultDatasetCard';
import { BaseDatasetCardProps } from './dataset/cards/DatasetCardTypes';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const formatIcons = getFormatIcons();
  
  // Check if user is admin - converted useState to useEffect with proper dependency array
  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await isUserAdmin();
      setIsAdmin(admin);
    };
    checkAdmin();
  }, []); // Empty dependency array ensures this runs only once on component mount
  
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    console.log(`Downloading dataset: ${id}`);
    // Add download logic here
  };

  // Handle dataset deletion
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setIsDeleting(true);
      
      try {
        console.log(`Deleting dataset with ID: ${id}`);
        const success = await deleteDataset(id);
        
        if (success) {
          toast.success(`Dataset "${title}" deleted successfully`);
          // Call the onDelete callback to refresh the parent component
          if (onDelete) {
            console.log("Calling onDelete callback after successful deletion");
            onDelete();
          }
        } else {
          toast.error("Failed to delete dataset");
        }
      } catch (error) {
        console.error("Error during dataset deletion:", error);
        toast.error("An error occurred while deleting the dataset");
      } finally {
        setIsDeleting(false);
      }
    }
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
        isDeleting={isDeleting}
        handleDelete={handleDelete}
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
        isDeleting={isDeleting}
        handleDelete={handleDelete}
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
      isDeleting={isDeleting}
      handleDelete={handleDelete}
      isHovered={isHovered}
      onDelete={onDelete}
    />
  );
};

export default DatasetCard;
