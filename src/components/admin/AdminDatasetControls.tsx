
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dataset } from '@/types/dataset';
import DatasetDeleteButton from '../dataset/DatasetDeleteButton';

interface AdminDatasetControlsProps {
  dataset: Dataset;
  isAdmin: boolean;
  onDataChange?: () => void;
}

const AdminDatasetControls = ({ dataset, isAdmin, onDataChange }: AdminDatasetControlsProps) => {
  const navigate = useNavigate();

  if (!isAdmin) return null;

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
        
        <DatasetDeleteButton 
          id={dataset.id}
          title={dataset.title}
          onDelete={onDataChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default AdminDatasetControls;
