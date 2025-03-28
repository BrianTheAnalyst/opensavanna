
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

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
    
    // Create the dataset entry
    const newDataset = {
      ...dataset,
      date: formattedDate,
      downloads: 0,
      user_id: user.id
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
    
    // If a file was provided, upload it to storage
    if (file && data.id) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${data.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dataset_files')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Dataset added but file upload failed');
        return data as Dataset;
      }
      
      // Get the public URL for the file
      const { data: publicURL } = supabase.storage
        .from('dataset_files')
        .getPublicUrl(filePath);
      
      // Update the dataset with the file URL
      const { error: updateError } = await supabase
        .from('datasets')
        .update({ file: publicURL.publicUrl })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error updating dataset with file URL:', updateError);
      } else {
        // Update the return data with the file URL
        data.file = publicURL.publicUrl;
      }
    }
    
    toast.success('Dataset added successfully');
    return data as Dataset;
  } catch (error) {
    console.error('Error adding dataset:', error);
    toast.error('Failed to add dataset');
    return null;
  }
};
