
import { useState } from 'react';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteDataset, isUserAdmin } from '@/services/datasetAdminService';
import { Dataset } from '@/types/dataset';
import { toast } from "sonner";

interface AdminDatasetControlsProps {
  dataset: Dataset;
  isAdmin: boolean;
  onDataChange?: () => void; // Add onDataChange prop
}

const AdminDatasetControls = ({ dataset, isAdmin, onDataChange }: AdminDatasetControlsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    console.log("Attempting to delete dataset:", dataset.id);
    
    try {
      const success = await deleteDataset(dataset.id);
      
      if (success) {
        toast.success(`Dataset "${dataset.title}" deleted successfully`);
        
        // Notify parent components about the data change
        if (onDataChange) {
          console.log("Calling onDataChange callback after successful deletion");
          onDataChange();
        }
        
        // Navigate back to datasets listing
        navigate('/datasets', { replace: true });
      } else {
        toast.error("Failed to delete dataset");
      }
    } catch (error) {
      console.error("Error during dataset deletion:", error);
      toast.error("An error occurred while deleting the dataset");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/datasets/edit/${dataset.id}`);
  };

  return (
    <div className="flex flex-col gap-2 border rounded-lg p-4 bg-background">
      <h3 className="text-sm font-medium mb-2">Admin Controls</h3>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <Button 
          variant="destructive" 
          className="flex-1"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the dataset "{dataset.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDatasetControls;
