
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDataset } from '@/services/datasetUploadService';
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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
    setUploadError(null); // Clear any previous errors when file changes
  };
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to upload datasets. Please log in and try again.");
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      console.log('Starting dataset upload', data);
      
      // Update format field based on selected file if available
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
        if (fileExt) {
          if (fileExt === 'csv' && (!data.format || data.format !== 'CSV')) {
            data.format = 'CSV';
            console.log('Format automatically set to CSV based on file extension');
          } else if ((fileExt === 'json' || fileExt === 'geojson') && 
                    (!data.format || (data.format !== 'JSON' && data.format !== 'GeoJSON'))) {
            data.format = fileExt === 'geojson' ? 'GeoJSON' : 'JSON';
            console.log(`Format automatically set to ${data.format} based on file extension`);
          }
        }
      }
      
      // Send to Supabase
      const { dataset, error } = await addDataset({
        title: data.title,
        description: data.description,
        category: data.category,
        format: data.format,
        country: data.country,
        featured: false
      }, selectedFile || undefined);
      
      if (dataset) {
        setUploadStep(2);
      } else {
        setUploadError(error || "Failed to upload dataset. Please check the console for more details.");
      }
    } catch (error) {
      console.error('Upload form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadError(`Failed to upload dataset: ${errorMessage}`);
      toast.error("Failed to upload dataset. Please try again.");
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
        {/* Show error message if upload failed */}
        {uploadError && (
          <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
            <p className="text-sm">{uploadError}</p>
          </div>
        )}
        
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
