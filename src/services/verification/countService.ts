
import { supabase } from "@/integrations/supabase/client";

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
