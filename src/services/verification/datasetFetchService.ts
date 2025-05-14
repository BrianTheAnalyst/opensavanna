
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
        description: "Could not fetch datasets for verification"
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
      description: "Could not fetch datasets for verification"
    });
    return [];
  }
};
