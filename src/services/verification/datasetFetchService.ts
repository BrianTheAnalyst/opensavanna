
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { DatasetWithEmail, Dataset } from "@/types/dataset";

// Fetch all datasets with their verification status and user email
export const fetchDatasetsWithVerificationStatus = async (): Promise<DatasetWithEmail[]> => {
  try {
    console.log("Fetching datasets for verification...");
    
    // Use explicit column selection to ensure we get all needed fields
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
    
    console.log(`Fetched ${data.length || 0} datasets`);
    
    // Convert to DatasetWithEmail type and ensure verification properties exist
    const datasetsWithEmail = data.map(dataset => {
      // Handle user_id if it's not in the Dataset type
      const userId = dataset.user_id;
      
      // Ensure verification_status is accessible via the TypeScript property
      return { 
        ...dataset, 
        userEmail: 'Unknown', // We'll set this later if user info is available
        verificationStatus: dataset.verification_status || 'pending',
        verificationNotes: dataset.verification_notes,
      } as DatasetWithEmail;
    });
    
    // For debugging: log the status of the first few datasets
    if (datasetsWithEmail.length > 0) {
      console.log('Sample dataset verification status:', 
        datasetsWithEmail.slice(0, 3).map(d => ({
          id: d.id,
          title: d.title,
          status: d.verificationStatus,
          db_status: d.verification_status
        }))
      );
    }
    
    return datasetsWithEmail;
  } catch (error) {
    console.error('Error fetching datasets with verification status:', error);
    toast("Failed to load datasets", {
      description: "Could not fetch datasets for verification"
    });
    return [];
  }
};

// Fetch user information separately if needed
const fetchUserEmail = async (userId: string): Promise<string> => {
  // This function is a placeholder
  // Since we can't access auth.users directly from JavaScript client
  // You would need a server function to get this information
  return 'Unknown';
};
