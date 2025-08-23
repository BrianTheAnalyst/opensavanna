
import { Download, Info, Calendar, FileText, Globe } from 'lucide-react';
import { useState } from 'react';

import AdminDatasetControls from '@/components/admin/AdminDatasetControls';
import { Button } from "@/components/ui/button";
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { downloadDataset } from '@/services/datasetDownloadService';
import { Dataset } from '@/types/dataset';

interface DatasetSidebarInfoProps {
  dataset: Dataset;
  onDataChange?: () => void;
}

const DatasetSidebarInfo = ({ dataset, onDataChange }: DatasetSidebarInfoProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useIsAdmin();

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await downloadDataset(dataset.id);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download dataset. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <aside className="space-y-4">
      <Button 
        className="w-full"
        disabled={isDownloading}
        onClick={handleDownload}
      >
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? 'Downloading...' : 'Download Dataset'}
      </Button>
      
      {error && (
        <div className="text-sm text-destructive mt-2 text-center">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-4 bg-background">
        <h3 className="text-sm font-medium mb-2">Dataset Information</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Format:</span>
            <span className="ml-auto font-medium">{dataset.format}</span>
          </li>
          <li className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Updated:</span>
            <span className="ml-auto font-medium">{dataset.date}</span>
          </li>
          <li className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Region:</span>
            <span className="ml-auto font-medium">{dataset.country}</span>
          </li>
          <li className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Category:</span>
            <span className="ml-auto font-medium">{dataset.category}</span>
          </li>
        </ul>
      </div>

      {/* Admin controls */}
      {isAdmin && <AdminDatasetControls dataset={dataset} isAdmin={isAdmin} onDataChange={onDataChange} />}
    </aside>
  );
};

export default DatasetSidebarInfo;
