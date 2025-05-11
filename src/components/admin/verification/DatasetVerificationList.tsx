
import { DatasetWithEmail } from '@/types/dataset';
import DatasetVerificationCard from '../DatasetVerificationCard';

interface DatasetVerificationListProps {
  datasets: DatasetWithEmail[];
  status: 'pending' | 'approved' | 'rejected';
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
  isLoading: boolean;
}

const DatasetVerificationList = ({ 
  datasets, 
  status, 
  updateStatus,
  isLoading 
}: DatasetVerificationListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-foreground/70">Loading datasets...</p>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-foreground/70">
          {status === 'pending' 
            ? 'No datasets awaiting review' 
            : status === 'approved' 
              ? 'No approved datasets' 
              : 'No rejected datasets'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {datasets.map((dataset) => (
        <DatasetVerificationCard 
          key={dataset.id} 
          dataset={dataset} 
          updateStatus={updateStatus}
        />
      ))}
    </div>
  );
};

export default DatasetVerificationList;
