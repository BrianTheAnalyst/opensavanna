
import { Link } from 'react-router-dom';
import { FileText, Download, Share, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Dataset } from '@/types/dataset';

interface DatasetHeaderProps {
  dataset: Dataset;
  handleDownload: () => Promise<void>;
}

const DatasetHeader = ({ dataset, handleDownload }: DatasetHeaderProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <>
      <div className="mb-6">
        <Link to="/datasets" className="text-sm flex items-center text-foreground/70 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all datasets
        </Link>
      </div>
      
      <div className="glass border border-border/50 rounded-xl p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {dataset.category}
              </span>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {dataset.format}
              </span>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {dataset.country}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-medium mb-2">{dataset.title}</h1>
            <p className="text-foreground/70">{dataset.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 ml-4">
            <Button variant="outline" size="sm" className="rounded-lg flex items-center" onClick={handleShare}>
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" className="rounded-lg flex items-center" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-xs text-foreground/60 mb-1">Downloads</p>
            <p className="text-lg font-medium flex items-center">
              <Download className="h-4 w-4 mr-1 text-primary" />
              {dataset.downloads?.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Updated</p>
            <p className="text-lg font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              {dataset.date}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Format</p>
            <p className="text-lg font-medium flex items-center">
              <FileText className="h-4 w-4 mr-1 text-primary" />
              {dataset.format}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Region</p>
            <p className="text-lg font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              {dataset.country}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatasetHeader;
