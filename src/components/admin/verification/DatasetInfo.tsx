
import { Link } from 'react-router-dom';
import { FileText, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DatasetWithEmail } from '@/types/dataset';

interface DatasetInfoProps {
  dataset: DatasetWithEmail;
}

const DatasetInfo = ({ dataset }: DatasetInfoProps) => {
  // Determine the effective verification status, considering both TypeScript property and DB column
  const effectiveStatus = dataset.verificationStatus || (dataset as any).verification_status || 'pending';

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <Link to={`/datasets/${dataset.id}`}>
          <h3 className="text-lg font-medium hover:text-primary transition-colors">
            {dataset.title}
          </h3>
        </Link>
        
        <Badge
          variant={
            effectiveStatus === 'approved'
              ? 'success'
              : effectiveStatus === 'rejected'
              ? 'destructive'
              : 'outline'
          }
          className={effectiveStatus === 'pending' ? "bg-yellow-100 text-yellow-800" : ""}
        >
          {effectiveStatus === 'approved'
            ? 'Approved'
            : effectiveStatus === 'rejected'
            ? 'Rejected'
            : 'Pending Review'}
        </Badge>
      </div>
      
      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
        {dataset.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <FileText className="w-4 h-4" />
          <span>{dataset.format}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <User className="w-4 h-4" />
          <span title={dataset.userEmail || 'Unknown'}>
            {dataset.userEmail 
              ? dataset.userEmail.length > 15 
                ? dataset.userEmail.substring(0, 15) + '...'
                : dataset.userEmail
              : 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <Calendar className="w-4 h-4" />
          <span>{dataset.date}</span>
        </div>
      </div>

      {dataset.verificationNotes && (
        <div className="bg-muted/40 p-3 rounded-md mb-4 text-sm">
          <p className="font-medium mb-1">Notes:</p>
          <p className="text-foreground/70">{dataset.verificationNotes}</p>
        </div>
      )}
    </>
  );
};

export default DatasetInfo;
