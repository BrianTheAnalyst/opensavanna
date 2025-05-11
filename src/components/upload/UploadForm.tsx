
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDataset } from '@/services/api';
import { formSchema, FormValues } from './uploadFormSchema';

// Import our new components
import FormFields from './FormFields';
import FileUploader from './FileUploader';
import SubmitStep from './SubmitStep';

interface UploadFormProps {
  isLoggedIn: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ isLoggedIn }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      country: "",
      format: ""
    }
  });
  
  // Handle file selection
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to upload datasets. Please log in and try again.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Send to Supabase
      const result = await addDataset({
        title: data.title,
        description: data.description,
        category: data.category,
        format: data.format,
        country: data.country
      }, selectedFile || undefined);
      
      if (result) {
        setUploadStep(2);
      }
    } catch (error) {
      toast.error("Failed to upload dataset. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  
  if (uploadStep === 2) {
    return <SubmitStep />;
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields component */}
        <FormFields form={form} />
        
        {/* File upload component */}
        <FileUploader onFileChange={handleFileChange} />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isUploading || !isLoggedIn}
          >
            {isUploading ? 'Uploading...' : 'Submit Dataset for Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UploadForm;
