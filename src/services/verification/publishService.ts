
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Publish a dataset (make it publicly available)
export const publishDataset = async (id: string): Promise<boolean> => {
  if (!id) {
    console.error('Error publishing dataset: No dataset ID provided');
    toast({
      title: "Publishing failed",
      description: "Invalid dataset ID",
      variant: "destructive"
    });
    throw new Error("Invalid dataset ID");
  }

  try {
    console.log(`Attempting to publish dataset ${id}`);
    
    // Check if the dataset exists first
    const { data: existingDataset, error: fetchError } = await supabase
      .from('datasets')
      .select('id, title, verification_status')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching dataset before publishing:', fetchError);
      toast({
        title: "Publishing failed",
        description: "Could not verify dataset exists",
        variant: "destructive"
      });
      throw new Error(`Dataset not found: ${fetchError.message}`);
    }
    
    if (existingDataset.verification_status !== 'approved') {
      console.error('Cannot publish dataset that is not approved');
      toast({
        title: "Publishing failed",
        description: "Only approved datasets can be published",
        variant: "destructive"
      });
      throw new Error("Dataset must be approved before publishing");
    }
    
    // Use the featured flag to publish the dataset
    const { error } = await supabase
      .from('datasets')
      .update({
        featured: true // Use featured flag as the publishing mechanism
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error publishing dataset:', error);
      toast({
        title: "Publishing failed",
        description: error.message || "Failed to update dataset status",
        variant: "destructive"
      });
      throw new Error(`Failed to publish dataset: ${error.message}`);
    }
    
    console.log(`Successfully published dataset ${id}`);
    toast({
      title: "Dataset published",
      description: "The dataset has been successfully published and is now featured"
    });
    return true;
  } catch (error) {
    console.error('Error publishing dataset:', error);
    if (!(error instanceof Error)) {
      throw new Error("Unknown error during publishing");
    }
    throw error; // Re-throw to allow component to handle
  }
};
