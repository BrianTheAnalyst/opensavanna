
import React from 'react';
import { Link } from 'react-router-dom';
import { DownloadCloud, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BaseDatasetCardProps, FormatIconsType } from './DatasetCardTypes';
import DatasetDeleteButton from '../DatasetDeleteButton';

interface FeaturedDatasetCardProps extends BaseDatasetCardProps {
  formatIcons: FormatIconsType;
  isAdmin: boolean;
  handleDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isHovered: boolean;
}

const FeaturedDatasetCard: React.FC<FeaturedDatasetCardProps> = ({
  id,
  title,
  description,
  category,
  format,
  country,
  downloads,
  formatIcons,
  isAdmin,
  handleDownload,
  onDelete,
}) => {
  return (
    <div 
      className="group relative glass border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30"
    >
      <div className="absolute top-0 left-0 p-3 z-10">
        <div className="text-xs px-2 py-1 bg-primary text-white rounded-full">
          Featured
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-1">{title}</h3>
          <p className="text-foreground/70">{description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-foreground/60">Category</p>
            <p className="text-sm font-medium">{category}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60">Region</p>
            <p className="text-sm font-medium">{country}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60">Format</p>
            <div className="flex items-center">
              {formatIcons[format] || formatIcons['CSV']}
              <span className="ml-1 text-sm font-medium">{format}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-foreground/60">Downloads</p>
            <p className="text-sm font-medium">{downloads.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-lg text-xs cursor-pointer"
            onClick={handleDownload}
          >
            <DownloadCloud className="mr-1 h-3 w-3" />
            Download
          </Button>
          <Link to={`/datasets/${id}`} className="flex-1">
            <Button 
              size="sm" 
              className="w-full rounded-lg text-xs group-hover:bg-primary/90 cursor-pointer"
            >
              <Eye className="mr-1 h-3 w-3" />
              Explore
            </Button>
          </Link>
        </div>
        
        {isAdmin && (
          <div className="mt-3">
            <DatasetDeleteButton
              id={id}
              title={title}
              onDelete={onDelete}
              variant="featured"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedDatasetCard;
