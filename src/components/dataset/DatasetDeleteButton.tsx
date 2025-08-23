
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteDataset } from '@/services/datasetAdminService';

interface DatasetDeleteButtonProps {
  id: string;
  title: string;
  onDelete?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

/**
 * Reusable delete button component for datasets
 * Handles confirmation, deletion process and error states
 */
const DatasetDeleteButton = ({ 
  id, 
  title, 
  onDelete, 
  variant = 'default',
  className = ''
}: DatasetDeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle dataset deletion with error handling and debounce
  const handleDelete = async () => {
    if (isDeleting) return; // Prevent double-clicks
    
    setIsDeleting(true);
    setError(null);
    
    try {
      console.log(`Deleting dataset with ID: ${id}`);
      const success = await deleteDataset(id);
      
      if (success) {
        toast.success(`Dataset "${title}" deleted successfully`);
        setIsOpen(false); // Close the dialog
        
        // Call the onDelete callback to refresh the parent component
        if (onDelete) {
          console.log("Calling onDelete callback after successful deletion");
          onDelete();
        }
      } else {
        setError("Failed to delete dataset. Please try again.");
        toast.error("Failed to delete dataset");
      }
    } catch (error) {
      console.error("Error during dataset deletion:", error);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An error occurred while deleting the dataset");
    } finally {
      setIsDeleting(false);
    }
  };

  // Style the button based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'compact':
        return "h-7 px-2 text-xs";
      case 'featured':
        return "w-full";
      default:
        return "";
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size={variant === 'compact' ? 'sm' : 'default'}
        className={`${getButtonStyle()} ${className}`}
        onClick={() => { setIsOpen(true); }}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3 mr-1" />
        )}
        {variant === 'featured' ? 'Delete Dataset' : 'Delete'}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Dataset Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Dataset'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DatasetDeleteButton;
