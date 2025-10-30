
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Download a dataset (updates download count and returns download URL)
export const downloadDataset = async (id: string): Promise<void> => {
  try {
    // First get the dataset to check if it has a file
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching dataset for download:', fetchError);
      toast.error('Unable to download dataset. Please try again.');
      return;
    }
    
    // Update download count
    const { error: updateError } = await supabase
      .from('datasets')
      .update({ downloads: (dataset.downloads || 0) + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating download count:', updateError);
    }
    
    // If the dataset has a file path, generate signed URL for secure access
    if (dataset.file) {
      try {
        // Generate a signed URL with 1 hour expiry
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('dataset_files')
          .createSignedUrl(dataset.file, 3600);
        
        if (signedUrlError || !signedUrlData) {
          console.error('Error creating signed URL:', signedUrlError);
          toast.error('Unable to generate download link. Please try again.');
          return;
        }
        
        window.open(signedUrlData.signedUrl, '_blank');
        toast.success('Dataset download started');
      } catch (urlError) {
        console.error('Error generating download URL:', urlError);
        toast.error('Unable to download dataset. Please try again.');
      }
    } else {
      toast.info('This dataset does not have a downloadable file');
    }
  } catch (error) {
    console.error('Error downloading dataset:', error);
    toast.error('Unable to download dataset. Please try again.');
  }
};
