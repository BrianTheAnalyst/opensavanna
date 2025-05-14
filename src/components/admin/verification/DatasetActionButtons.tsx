
import { Check, X, MessageSquare, Globe, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; 

interface DatasetActionButtonsProps {
  status: 'pending' | 'approved' | 'rejected';
  datasetId: string;
  onApprove: () => void;
  onReject: () => void;
  onFeedback: () => void;
  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  publishDataset?: (id: string) => Promise<void>;
  isPublishing?: boolean;
  hasError?: boolean;
}

const DatasetActionButtons = ({ 
  status, 
  datasetId, 
  onApprove, 
  onReject, 
  onFeedback,
  updateStatus,
  publishDataset,
  isPublishing = false,
  hasError = false
}: DatasetActionButtonsProps) => {
  
  const handleResetStatus = async () => {
    try {
      await updateStatus(datasetId, 'pending');
      toast("Status reset", {
        description: "Dataset has been reset to pending status"
      });
    } catch (err) {
      console.error("Error resetting status:", err);
      toast("Failed to reset status", {
        description: "There was an error resetting the dataset status"
      });
    }
  };
  
  if (status === 'pending') {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1 border-green-300 text-green-800 hover:bg-green-100"
          onClick={onApprove}
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
          onClick={onReject}
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onFeedback}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Feedback
        </Button>
      </div>
    );
  }
  
  if (status === 'approved') {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {publishDataset && (
          <Button
            variant="default" 
            className={`flex-1 ${hasError ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={() => publishDataset(datasetId)}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : hasError ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Publishing
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Publish Dataset
              </>
            )}
          </Button>
        )}
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleResetStatus}
        >
          Reset to Pending
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onFeedback}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Feedback
        </Button>
      </div>
    );
  }
  
  // For rejected status
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="outline"
        className="flex-1"
        onClick={handleResetStatus}
      >
        Reset to Pending
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={onFeedback}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Feedback
      </Button>
    </div>
  );
};

export default DatasetActionButtons;
