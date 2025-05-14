
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Publish a dataset (make it publicly available)
export const publishDataset = async (id: string): Promise<boolean> => {
  try {
    console.log(`Publishing dataset ${id}`);
    
    // Use the featured flag to publish the dataset
    const { error } = await supabase
      .from('datasets')
      .update({
        featured: true // Use featured flag as the publishing mechanism
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error publishing dataset:', error);
      toast("Publishing failed", {
        description: "Failed to publish dataset"
      });
      return false;
    }
    
    console.log(`Successfully published dataset ${id}`);
    return true;
  } catch (error) {
    console.error('Error publishing dataset:', error);
    toast("Publishing failed", {
      description: "Failed to publish dataset"
    });
    return false;
  }
};
