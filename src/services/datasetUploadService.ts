
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

import { processDatasetFile } from "./processing/datasetProcessor";

// Add a new dataset
export const addDataset = async (
  dataset: Omit<Dataset, 'id' | 'date' | 'downloads'>,
  file?: File
): Promise<Dataset | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to upload datasets');
      return null;
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
      if (error.code === '23502') {
        toast.error('Missing required fields. Please complete all required fields.');
      } else if (error.code === '23505') {
        toast.error('A dataset with this name may already exist.');
      } else if (error.code === '42P01') {
        toast.error('Database configuration issue. Please contact support.');
      } else {
        toast.error(`Failed to add dataset: ${error.message}`);
      }
      
      return null;
    }
    
    if (!data) {
      console.error('No data returned after dataset insertion');
      toast.error('Failed to create dataset record');
      return null;
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
        if (uploadError.message.includes('size')) {
          toast.error('File exceeds the maximum upload size limit of 100MB');
        } else if (uploadError.message.includes('permission')) {
          toast.error('Storage permission denied. You may need to log in again.');
        } else if (uploadError.message.includes('bucket')) {
          toast.error('Storage bucket not found. Please contact support.');
        } else {
          toast.error(`Dataset added but file upload failed: ${uploadError.message}`);
        }
        return data as Dataset;
      }
      
      console.log('File uploaded successfully');
      
      // Get the public URL for the file
      const { data: publicURL } = supabase.storage
        .from('dataset_files')
        .getPublicUrl(filePath);
      
      if (!publicURL || !publicURL.publicUrl) {
        console.error('Failed to get public URL for uploaded file');
        toast.error('Dataset added but could not get file URL');
        return data as Dataset;
      }
      
      // Process the uploaded file to extract real data and insights
      toast.info('Processing dataset file...');
      
      // Process the file in the background
      try {
        console.log('Beginning file processing');
        const processedData = await processDatasetFile(file, data.id);
        console.log('File processing complete', processedData ? `with ${Array.isArray(processedData) ? processedData.length : 0} records` : 'with no data');
        
        // Update the dataset with the file URL and any additional metadata
        const updateData: any = { 
          file: publicURL.publicUrl 
        };
        
        // If we successfully processed the data, add data points count
        if (processedData && Array.isArray(processedData)) {
          updateData.dataPoints = processedData.length;
        }
        
        const { error: updateError } = await supabase
          .from('datasets')
          .update(updateData)
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Error updating dataset with file URL:', updateError);
          toast.error(`Failed to update dataset with file information: ${updateError.message}`);
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
          return updatedData;
        }
      } catch (processingError) {
        console.error('Error during file processing:', processingError);
        toast.error('Dataset added but file processing failed');
      }
      
      toast.success('Dataset added successfully');
      return data as Dataset;
    }
    
    toast.success('Dataset submitted for review');
    return data as Dataset;
  } catch (error) {
    console.error('Error adding dataset:', error);
    if (error instanceof Error) {
      toast.error(`Failed to add dataset: ${error.message}`);
    } else {
      toast.error('Failed to add dataset due to an unknown error');
    }
    return null;
  }
};
