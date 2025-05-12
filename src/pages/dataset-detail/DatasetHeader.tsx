
import { Dataset } from "@/types/dataset";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Globe } from "lucide-react";
import { formatDataPoints } from "@/utils/dataFormatUtils";
import DatasetVerificationStatus from "@/components/dataset/DatasetVerificationStatus";

interface DatasetHeaderProps {
  dataset: Dataset;
}

const DatasetHeader = ({ dataset }: DatasetHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">{dataset.title}</h1>
        <DatasetVerificationStatus dataset={dataset} />
      </div>

      <p className="text-muted-foreground mb-4 max-w-3xl">{dataset.description}</p>
      
      <div className="flex flex-wrap gap-3 text-sm">
        <Badge variant="outline" className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {dataset.format.toUpperCase()}
        </Badge>
        
        <Badge variant="outline" className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" />
          {dataset.country}
        </Badge>
        
        <Badge variant="outline" className="flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" />
          {dataset.downloads || 0} downloads
        </Badge>
        
        {dataset.dataPoints && (
          <Badge variant="outline" className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {formatDataPoints(dataset.dataPoints)} data points
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DatasetHeader;
