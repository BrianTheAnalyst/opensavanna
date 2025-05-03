
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const UploadSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Submission Successful!</h3>
      <p className="text-foreground/70 mb-2">
        Your dataset has been submitted and is pending verification.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Our team will review your submission to ensure data quality and compliance with African data protection laws.
      </p>
      <Button onClick={() => navigate('/datasets')}>
        View All Datasets
      </Button>
    </div>
  );
};

export default UploadSuccess;
