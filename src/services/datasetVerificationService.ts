
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatasetWithEmail, Dataset } from "@/types/dataset";

// Fetch all datasets with their verification status and user email
export const fetchDatasetsWithVerificationStatus = async (): Promise<DatasetWithEmail[]> => {
  try {
    console.log("Fetching datasets for verification...");
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching datasets:', error);
      toast("Failed to load datasets", {
        description: "Could not fetch datasets for verification",
      });
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} datasets`);
    
    // For each dataset, try to get the user's email (if user_id exists)
    const datasetsWithEmail = await Promise.all(
      (data as Dataset[]).map(async (dataset) => {
        // Handle user_id if it's not in the Dataset type
        const userId = (dataset as any).user_id;
        if (!userId) {
          return { 
            ...dataset, 
            userEmail: 'Unknown',
            // Ensure verification status is accessible via the TypeScript property
            verificationStatus: (dataset as any).verification_status || dataset.verificationStatus || 'pending',
            verificationNotes: (dataset as any).verification_notes || dataset.verificationNotes,
          };
        }
        
        // Try to get user email
        try {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
          
          if (userError || !userData || !userData.user) {
            console.log(`Couldn't get user data for ID: ${userId}`, userError);
            return { 
              ...dataset, 
              userEmail: 'Unknown',
              verificationStatus: (dataset as any).verification_status || dataset.verificationStatus || 'pending',
              verificationNotes: (dataset as any).verification_notes || dataset.verificationNotes,
            };
          }
          
          return { 
            ...dataset, 
            userEmail: userData.user.email || 'Unknown',
            verificationStatus: (dataset as any).verification_status || dataset.verificationStatus || 'pending',
            verificationNotes: (dataset as any).verification_notes || dataset.verificationNotes,
          };
        } catch (err) {
          console.error('Error fetching user email:', err);
          return { 
            ...dataset, 
            userEmail: 'Unknown',
            verificationStatus: (dataset as any).verification_status || dataset.verificationStatus || 'pending',
            verificationNotes: (dataset as any).verification_notes || dataset.verificationNotes,
          };
        }
      })
    );
    
    return datasetsWithEmail;
  } catch (error) {
    console.error('Error fetching datasets with verification status:', error);
    toast("Failed to load datasets", {
      description: "Could not fetch datasets for verification",
    });
    return [];
  }
};

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
        description: "Failed to update verification status",
      });
      return false;
    }
    
    console.log(`Successfully updated dataset ${id} status to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating dataset verification status:', error);
    toast("Update failed", {
      description: "Failed to update verification status",
    });
    return false;
  }
};

// Publish a dataset (make it publicly available)
export const publishDataset = async (id: string): Promise<boolean> => {
  try {
    console.log(`Publishing dataset ${id}`);
    
    // Use the correct column names for the datasets table
    const { error } = await supabase
      .from('datasets')
      .update({
        featured: true, // Use featured flag instead of published which doesn't exist
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error publishing dataset:', error);
      toast("Publishing failed", {
        description: "Failed to publish dataset",
      });
      return false;
    }
    
    console.log(`Successfully published dataset ${id}`);
    return true;
  } catch (error) {
    console.error('Error publishing dataset:', error);
    toast("Publishing failed", {
      description: "Failed to publish dataset", 
    });
    return false;
  }
};

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
        description: "Failed to send feedback: dataset not found",
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
        description: "Failed to save feedback",
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
      description: "Failed to send feedback",
    });
    return false;
  }
};

// Get count of datasets pending verification
export const fetchPendingDatasetCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('datasets')
      .select('*', { count: 'exact', head: true })
      .or('verification_status.is.null,verification_status.eq.pending');
    
    if (error) {
      console.error('Error counting pending datasets:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error counting pending datasets:', error);
    return 0;
  }
};
