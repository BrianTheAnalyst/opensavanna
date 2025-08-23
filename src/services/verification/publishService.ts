
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

// Publish a dataset (make it publicly available)
export const publishDataset = async (id: string): Promise<boolean> => {
  if (!id) {
    console.error('Error publishing dataset: No dataset ID provided');
    toast.error("Publishing failed", {
      description: "Invalid dataset ID"
    });
    throw new Error("Invalid dataset ID");
  }

  try {
    console.log(`Attempting to publish dataset ${id}`);
    
    // Check if the dataset exists first and verify its status
    const { data: existingDataset, error: fetchError } = await supabase
      .from('datasets')
      .select('id, title, verification_status')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching dataset before publishing:', fetchError);
      toast.error("Publishing failed", {
        description: "Could not verify dataset exists"
      });
      throw new Error(`Dataset not found: ${fetchError.message}`);
    }
    
    console.log('Dataset verification status check:', existingDataset);
    
    // Explicit check to ensure the dataset is actually approved
    if (!existingDataset) {
      console.error('Dataset not found for publishing');
      toast.error("Publishing failed", {
        description: "Dataset not found"
      });
      throw new Error('Dataset not found for publishing');
    }
    
    // Very explicit logging and verification to help debug the issue
    console.log(`Dataset ${id} verification status before publishing:`, existingDataset.verification_status);
    
    if (existingDataset.verification_status !== 'approved') {
      console.error(`Cannot publish dataset that is not approved in the database. Current status:`, 
        existingDataset.verification_status);
      toast.error("Publishing failed", {
        description: `Dataset must be approved before publishing. Current status in database: ${existingDataset.verification_status}`
      });
      throw new Error(`Dataset must be approved before publishing. Current status: ${existingDataset.verification_status}`);
    }
    
    // Use the featured flag to publish the dataset
    const { data, error } = await supabase
      .from('datasets')
      .update({
        featured: true // Use featured flag as the publishing mechanism
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error publishing dataset:', error);
      toast.error("Publishing failed", {
        description: error.message || "Failed to update dataset status"
      });
      throw new Error(`Failed to publish dataset: ${error.message}`);
    }
    
    console.log(`Successfully published dataset ${id}. Updated data:`, data);
    toast.success("Dataset published", {
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
