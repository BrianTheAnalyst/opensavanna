
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

// Update the verification status of a dataset
export const updateDatasetVerificationStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean, data?: any, error?: any }> => {
  try {
    console.log(`Updating dataset ${id} to status: ${status}`);
    
    // Validate input parameters
    if (!id) {
      console.error('Invalid dataset ID provided');
      toast.error("Update failed", {
        description: "Invalid dataset ID"
      });
      return { success: false, error: "Invalid dataset ID" };
    }
    
    // First verify the dataset exists
    const { data: existingDataset, error: fetchError } = await supabase
      .from('datasets')
      .select('id, title, verification_status')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingDataset) {
      console.error('Error fetching dataset before update:', fetchError);
      toast.error("Update failed", {
        description: "Could not find dataset"
      });
      return { success: false, error: fetchError };
    }
    
    // Log current status for debugging
    console.log(`Current dataset status in database: ${existingDataset.verification_status}`);
    
    // Validate status to ensure it's a valid value
    if (status !== 'pending' && status !== 'approved' && status !== 'rejected') {
      console.error(`Invalid status value: ${status}`);
      toast.error("Update failed", {
        description: "Invalid status value"
      });
      return { success: false, error: "Invalid status value" };
    }
    
    // Now that we have the proper columns in the database, we can use them directly
    const updates: any = {
      verification_status: status
    };
    
    if (notes) {
      updates.verification_notes = notes;
    }
    
    console.log(`Sending update to database with payload:`, updates);
    
    // Use a more direct approach with explicit column selection
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select('id, title, verification_status, verification_notes');
    
    if (error) {
      console.error('Error updating dataset verification status:', error);
      toast.error("Update failed", {
        description: "Failed to update verification status: " + error.message
      });
      return { success: false, error };
    }
    
    console.log(`Successfully updated dataset ${id} status to ${status}. Database returned:`, data);
    toast.success(`Dataset ${status}`, {
      description: `${existingDataset.title} has been ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated to pending'}${notes ? ' with notes' : ''}.`
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating dataset verification status:', error);
    toast.error("Update failed", {
      description: "Failed to update verification status"
    });
    return { success: false, error };
  }
};
