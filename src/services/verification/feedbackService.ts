
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

// Send feedback to dataset contributor
export const sendDatasetFeedback = async (
  id: string,
  feedback: string
): Promise<boolean> => {
  try {
    // First, get the dataset to find the user_id
    const { data: dataset, error: datasetError } = await supabase
      .from('datasets')
      .select('*, user_id')
      .eq('id', id)
      .single();
    
    if (datasetError || !dataset) {
      console.error('Error fetching dataset for feedback:', datasetError);
      toast("Feedback failed", {
        description: "Failed to send feedback: dataset not found"
      });
      return false;
    }
    
    // Store feedback in the verification_notes field
    const updates = {
      verification_notes: feedback,
      verification_feedback_sent: new Date().toISOString()
    };
    
    const { error: updateError } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id);
    
    if (updateError) {
      console.error('Error saving feedback:', updateError);
      toast("Feedback failed", {
        description: "Failed to save feedback"
      });
      return false;
    }
    
    // For now, we'll just store the feedback
    // In a production app, you would implement email notifications here
    
    console.log(`Successfully sent feedback for dataset ${id}`);
    return true;
  } catch (error) {
    console.error('Error sending dataset feedback:', error);
    toast("Feedback failed", {
      description: "Failed to send feedback"
    });
    return false;
  }
};
