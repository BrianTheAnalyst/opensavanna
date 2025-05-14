
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
    
    // Now that we have the proper columns in the database, we can use them directly
    const updates: any = {
      verification_status: status
    };
    
    if (notes) {
      updates.verification_notes = notes;
    }
    
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select('id, title, verification_status, verification_notes')
      .single();
    
    if (error) {
      console.error('Error updating dataset verification status:', error);
      toast.error("Update failed", {
        description: "Failed to update verification status"
      });
      return { success: false, error };
    }
    
    console.log(`Successfully updated dataset ${id} status to ${status}. Database returned:`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating dataset verification status:', error);
    toast.error("Update failed", {
      description: "Failed to update verification status"
    });
    return { success: false, error };
  }
};
