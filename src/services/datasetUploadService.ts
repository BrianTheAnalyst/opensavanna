
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
    const newDataset = {
      ...dataset,
      date: formattedDate,
      downloads: 0,
      user_id: user.id,
      verificationStatus: 'pending'
    };
    
    const { data, error } = await supabase
      .from('datasets')
      .insert(newDataset)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding dataset:', error);
      toast.error('Failed to add dataset');
      return null;
    }
    
    // If a file was provided, upload and process it
    if (file && data.id) {
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${data.id}/${Date.now()}.${fileExt}`;
      
      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('dataset_files')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        // Check if the error is related to file size
        if (uploadError.message?.includes('size')) {
          toast.error('File exceeds the maximum upload size limit of 100MB');
        } else {
          toast.error('Dataset added but file upload failed');
        }
        return data as Dataset;
      }
      
      // Get the public URL for the file
      const { data: publicURL } = supabase.storage
        .from('dataset_files')
        .getPublicUrl(filePath);
      
      // Process the uploaded file to extract real data and insights
      toast.info('Processing dataset file...');
      
      // Process the file in the background
      const processedData = await processDatasetFile(file, data.id);
      
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
      
      toast.success('Dataset processed successfully');
    }
    
    toast.success('Dataset submitted for review');
    return data as Dataset;
  } catch (error) {
    console.error('Error adding dataset:', error);
    toast.error('Failed to add dataset');
    return null;
  }
};
