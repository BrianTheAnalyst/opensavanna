
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Clock, CheckCircle, X } from 'lucide-react';
import { Dataset } from '@/types/dataset';

interface DatasetWithEmail extends Dataset {
  email?: string;
}

interface DatasetVerificationCardProps {
  dataset: DatasetWithEmail;
  onReview: (dataset: DatasetWithEmail) => void;
}

// Status badge component
export const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const DatasetVerificationCard = ({ dataset, onReview }: DatasetVerificationCardProps) => {
  return (
    <Card key={dataset.id} className="p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">{dataset.title}</h3>
            <StatusBadge status={dataset.verificationStatus || 'pending'} />
          </div>
          <p className="text-sm text-foreground/70 mt-1 mb-2">{dataset.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-foreground/50">Category:</span> {dataset.category}
            </div>
            <div>
              <span className="text-foreground/50">Format:</span> {dataset.format}
            </div>
            <div>
              <span className="text-foreground/50">Country/Region:</span> {dataset.country}
            </div>
            <div>
              <span className="text-foreground/50">Source:</span> {dataset.source || 'Not specified'}
            </div>
            <div>
              <span className="text-foreground/50">Submitter:</span> {dataset.email}
            </div>
            <div>
              <span className="text-foreground/50">Submitted:</span> {new Date(dataset.created_at || '').toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 justify-center items-start md:items-end">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onReview(dataset)}
          >
            Review Dataset
          </Button>
          
          {dataset.file && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => window.open(dataset.file, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View File
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DatasetVerificationCard;
export { StatusBadge };
