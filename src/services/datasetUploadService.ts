
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
        toast.error('Failed to add dataset. Please try again.');
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
        if (uploadError.message?.includes('size')) {
          toast.error('File exceeds the maximum upload size limit of 100MB');
        } else if (uploadError.message?.includes('permission')) {
          toast.error('Storage permission denied. You may need to log in again.');
        } else if (uploadError.message?.includes('bucket')) {
          toast.error('Storage bucket not found. Please contact support.');
        } else {
          toast.error('Dataset added but file upload failed. Please try again.');
        }
        return data as Dataset;
      }
      
      console.log('File uploaded successfully');
      
      // Store the file path instead of public URL since bucket is now private
      const fileUrl = filePath;
      
      // Process the uploaded file to extract real data and insights
      toast.info('Processing dataset file...');
      
      // Process the file in the background
      try {
        console.log('Beginning file processing');
        const processedData = await processDatasetFile(file, data.id);
        console.log('File processing complete', processedData ? `with ${Array.isArray(processedData) ? processedData.length : 0} records` : 'with no data');
        
        // Update the dataset with the file path
        const updateData: any = { 
          file: fileUrl 
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
          console.error('Error updating dataset with file path:', updateError);
          toast.error('Failed to update dataset with file information');
        } else {
          // Update the return data with the file path
          const updatedData = {
            ...(data as any),
            file: fileUrl
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
    toast.error('Failed to add dataset. Please try again.');
    return null;
  }
};
