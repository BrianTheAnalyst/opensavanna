
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
      toast.error('Failed to download dataset');
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
    
    // If the dataset has a file URL, open it
    if (dataset.file) {
      window.open(dataset.file, '_blank');
      toast.success('Dataset download started');
    } else {
      // For datasets without files, we could provide a fallback
      toast.info('This dataset does not have a downloadable file');
    }
  } catch (error) {
    console.error('Error downloading dataset:', error);
    toast.error('Failed to download dataset');
  }
};
