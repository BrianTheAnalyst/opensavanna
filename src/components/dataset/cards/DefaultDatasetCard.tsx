
import { ArrowUpRight, DownloadCloud, MapPin } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import DatasetDeleteButton from '../DatasetDeleteButton';

import { BaseDatasetCardProps, FormatIconsType } from './DatasetCardTypes';


interface DefaultDatasetCardProps extends BaseDatasetCardProps {
  formatIcons: FormatIconsType;
  isAdmin: boolean;
  isHovered: boolean;
}

const DefaultDatasetCard: React.FC<DefaultDatasetCardProps> = ({
  id,
  title,
  description,
  category,
  format,
  country,
  date,
  downloads,
  formatIcons,
  isAdmin,
  isHovered,
  onDelete,
}) => {
  return (
    <div className="relative">
      <Link 
        to={`/datasets/${id}`}
        className="block relative glass border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 cursor-pointer"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex items-center">
                {formatIcons[format] || formatIcons['CSV']}
                <span className="ml-1">{format}</span>
              </span>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                {category}
              </span>
            </div>
            <span className="text-xs text-foreground/60">{date}</span>
          </div>
          
          <h3 className="text-lg font-medium mb-1 pr-6 group-hover:text-primary transition-colors">
            {title}
            <ArrowUpRight 
              className={`inline-block ml-1 h-3 w-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
            />
          </h3>
          <p className="text-sm text-foreground/70 line-clamp-2 mb-3">{description}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-foreground/60">
              <span className="inline-flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {country}
              </span>
            </div>
            <div className="text-xs text-foreground/60">
              <span className="inline-flex items-center">
                <DownloadCloud className="h-3 w-3 mr-1" />
                {downloads.toLocaleString()} downloads
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      {isAdmin && (
        <div className="mt-2 flex justify-end">
          <DatasetDeleteButton
            id={id}
            title={title}
            onDelete={onDelete}
            variant="compact"
          />
        </div>
      )}
    </div>
  );
};

export default DefaultDatasetCard;
