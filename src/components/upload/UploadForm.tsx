
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDataset } from '@/services/api';
import WithErrorBoundary from '@/components/WithErrorBoundary';

// Import components
import BasicFormFields from './BasicFormFields';
import CategorySelectors from './CategorySelectors';
import FileUploader from './FileUploader';
import UploadSuccess from './UploadSuccess';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  country: z.string().min(1, { message: "Please select a country" }),
  format: z.string().min(1, { message: "Please select a format" }),
  source: z.string().min(3, { message: "Please provide the data source" }),
  file: z.any().optional() // Make file optional
});

type FormValues = z.infer<typeof formSchema>;

const UploadForm = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const navigate = useNavigate();
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
      format: "",
      source: ""
    }
  });
  
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
      // Send to Supabase - removed verification status
      const result = await addDataset({
        title: data.title,
        description: data.description,
        category: data.category,
        format: data.format,
        country: data.country,
        source: data.source,
        verified: false
      }, selectedFile || undefined);
      
      if (result) {
        setUploadStep(2);
        
        // Navigate to datasets page after short delay
        setTimeout(() => {
          navigate('/datasets');
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to upload dataset. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadStep === 2) {
    return <UploadSuccess />;
  }

  return (
    <WithErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicFormFields control={form.control} />
          <CategorySelectors control={form.control} />
          <FileUploader onFileChange={handleFileChange} />
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || !isLoggedIn}
            >
              {isUploading ? 'Uploading...' : 'Submit Dataset'}
            </Button>
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Your dataset will be published to the African Data Commons
            </p>
          </div>
        </form>
      </Form>
    </WithErrorBoundary>
  );
};

export default UploadForm;
