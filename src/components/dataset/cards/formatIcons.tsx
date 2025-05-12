
import React from 'react';
import { FileText, MapPin, BarChart3 } from 'lucide-react';
import { FormatIconsType } from './DatasetCardTypes';

// Create and export the format icons mapping
export const getFormatIcons = (): FormatIconsType => ({
  'CSV': <FileText className="h-4 w-4" />,
  'JSON': <FileText className="h-4 w-4" />,
  'GeoJSON': <MapPin className="h-4 w-4" />,
  'Chart': <BarChart3 className="h-4 w-4" />,
});
