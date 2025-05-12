
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { BaseDatasetCardProps, FormatIconsType } from './DatasetCardTypes';
import DatasetDeleteButton from '../DatasetDeleteButton';

interface CompactDatasetCardProps extends BaseDatasetCardProps {
  formatIcons: FormatIconsType;
  isAdmin: boolean;
}

const CompactDatasetCard: React.FC<CompactDatasetCardProps> = ({
  id,
  title,
  country,
  format,
  isAdmin,
  formatIcons,
  onDelete,
}) => {
  return (
    <Link 
      to={`/datasets/${id}`}
      className="block glass border border-border/50 rounded-xl p-3 transition-all duration-300 hover:shadow-md hover:border-primary/20 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
          <p className="text-xs text-foreground/60 line-clamp-1">{country}</p>
        </div>
        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
          {formatIcons[format] || formatIcons['CSV']}
        </span>
      </div>
      
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
    </Link>
  );
};

export default CompactDatasetCard;
