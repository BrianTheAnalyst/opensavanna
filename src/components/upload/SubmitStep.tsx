
import React from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SubmitStep: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <UploadCloud className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Dataset Submitted!</h3>
      <p className="text-foreground/70 mb-6">
        Your dataset has been submitted for review. We'll notify you once it's approved and available to the community.
      </p>
      <Button onClick={() => navigate('/datasets')}>
        View All Datasets
      </Button>
    </div>
  );
};

export default SubmitStep;
