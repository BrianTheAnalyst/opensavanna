
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BaseDatasetCardProps, FormatIconsType } from './DatasetCardTypes';

interface CompactDatasetCardProps extends BaseDatasetCardProps {
  formatIcons: FormatIconsType;
  isAdmin: boolean;
  isDeleting: boolean;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CompactDatasetCard: React.FC<CompactDatasetCardProps> = ({
  id,
  title,
  country,
  format,
  isAdmin,
  isDeleting,
  handleDelete,
  formatIcons,
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
          <Button
            variant="destructive"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      )}
    </Link>
  );
};

export default CompactDatasetCard;
