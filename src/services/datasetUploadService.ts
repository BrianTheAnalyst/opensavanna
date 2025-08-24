
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";
import { processDatasetFile } from "./processing/datasetProcessor";

// Add a new dataset
export const addDataset = async (
  dataset: Omit<Dataset, 'id' | 'date' | 'downloads'>,
  file?: File
): Promise<{ dataset: Dataset | null, error: string | null }> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const errorMessage = 'You must be logged in to upload datasets';
      toast.error(errorMessage);
      return { dataset: null, error: errorMessage };
    }
    
    // Format the date
    const currentDate = new Date();
    const formattedDate = `Updated ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    
    // Create the dataset entry with pending verification status
    // Important: Use snake_case field names to match the database schema
    const newDataset = {
      ...dataset,
      date: formattedDate,
      downloads: 0,
      user_id: user.id,
      verification_status: 'pending' // Changed from verificationStatus to verification_status
    };
    
    console.log('Inserting dataset into database:', JSON.stringify(newDataset));
    
    const { data, error } = await supabase
      .from('datasets')
      .insert(newDataset)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding dataset:', error);
      
      // More specific error messages based on error codes
      let errorMessage: string;
      if (error.code === '23502') {
        errorMessage = 'Missing required fields. Please complete all required fields.';
      } else if (error.code === '23505') {
        errorMessage = 'A dataset with this name may already exist.';
      } else if (error.code === '42P01') {
        errorMessage = 'Database configuration issue. Please contact support.';
      } else {
        errorMessage = `Failed to add dataset: ${error.message}`;
      }
      toast.error(errorMessage);
      return { dataset: null, error: errorMessage };
    }
    
    if (!data) {
      const errorMessage = 'Failed to create dataset record';
      console.error('No data returned after dataset insertion');
      toast.error(errorMessage);
      return { dataset: null, error: errorMessage };
    }
    
    console.log('Dataset inserted successfully:', data.id);
    
    // If a file was provided, upload and process it
    if (file && data.id) {
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${data.id}/${Date.now()}.${fileExt}`;
      
      console.log(`Uploading file to path: ${filePath}`);
      
      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('dataset_files')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        // Check if the error is related to file size
        let errorMessage: string;
        if (uploadError.message?.includes('size')) {
          errorMessage = 'File exceeds the maximum upload size limit of 100MB';
        } else if (uploadError.message?.includes('permission')) {
          errorMessage = 'Storage permission denied. You may need to log in again.';
        } else if (uploadError.message?.includes('bucket')) {
          errorMessage = 'Storage bucket not found. Please contact support.';
        } else {
          errorMessage = `Dataset added but file upload failed: ${uploadError.message}`;
        }
        toast.error(errorMessage);
        return { dataset: data as Dataset, error: errorMessage };
      }
      
      console.log('File uploaded successfully');
      
      // Get the public URL for the file
      const { data: publicURL } = supabase.storage
        .from('dataset_files')
        .getPublicUrl(filePath);
      
      if (!publicURL || !publicURL.publicUrl) {
        const errorMessage = 'Dataset added but could not get file URL';
        console.error('Failed to get public URL for uploaded file');
        toast.error(errorMessage);
        return { dataset: data as Dataset, error: errorMessage };
      }
      
      // Process the uploaded file to extract real data and insights
      toast.info('Processing dataset file...');
      
      // Process the file in the background
      try {
        console.log('Beginning file processing');
        const result = await processDatasetFile(file, data.id);
        console.log('File processing complete', result ? `with ${Array.isArray(result.data) ? result.data.length : 0} records` : 'with no data');
        
        // Update the dataset with the file URL and any additional metadata
        const updateData: any = { 
          file: publicURL.publicUrl 
        };
        
        // If we successfully processed the data, add data points count
        if (result && result.data && Array.isArray(result.data)) {
          updateData.dataPoints = result.data.length;
        }
        
        const { error: updateError } = await supabase
          .from('datasets')
          .update(updateData)
          .eq('id', data.id);
        
        if (updateError) {
          const errorMessage = `Failed to update dataset with file information: ${updateError.message}`;
          console.error('Error updating dataset with file URL:', updateError);
          toast.error(errorMessage);
        } else {
          // Update the return data with the file URL
          // Create a new object with the proper type cast to include dataPoints
          const updatedData = {
            ...(data as any),
            file: publicURL.publicUrl
          } as Dataset;
          
          // Add the dataPoints property if available
          if (updateData.dataPoints) {
            updatedData.dataPoints = updateData.dataPoints;
          }
          
          toast.success('Dataset processed successfully');
          return { dataset: updatedData, error: null };
        }
      } catch (processingError) {
        const errorMessage = 'Dataset added but file processing failed';
        console.error('Error during file processing:', processingError);
        toast.error(errorMessage);
      }
      
      toast.success('Dataset added successfully');
      return { dataset: data as Dataset, error: null };
    }
    
    toast.success('Dataset submitted for review');
    return { dataset: data as Dataset, error: null };
  } catch (error) {
    console.error('Error adding dataset:', error);
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = `Failed to add dataset: ${error.message}`;
    } else {
      errorMessage = 'Failed to add dataset due to an unknown error';
    }
    toast.error(errorMessage);
    return { dataset: null, error: errorMessage };
  }
};
