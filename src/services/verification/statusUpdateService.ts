
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Update the verification status of a dataset
export const updateDatasetVerificationStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<boolean> => {
  try {
    console.log(`Updating dataset ${id} to status: ${status}`);
    
    // Now that we have the proper columns in the database, we can use them directly
    const updates: any = {
      verification_status: status
    };
    
    if (notes) {
      updates.verification_notes = notes;
    }
    
    const { error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating dataset verification status:', error);
      toast("Update failed", {
        description: "Failed to update verification status"
      });
      return false;
    }
    
    console.log(`Successfully updated dataset ${id} status to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating dataset verification status:', error);
    toast("Update failed", {
      description: "Failed to update verification status"
    });
    return false;
  }
};
