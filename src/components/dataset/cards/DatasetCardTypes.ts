
import { ReactNode } from 'react';

// Shared props that all dataset cards will use
export interface BaseDatasetCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number;
  onDelete?: () => void;
}

// Format icons mapping
export type FormatIconsType = Record<string, ReactNode>;
