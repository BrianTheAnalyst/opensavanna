
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface DebugStatusBadgeProps {
  datasetId: string;
  uiStatus: string;
}

/**
 * A debug component that shows both UI and database status
 * to help detect inconsistencies
 */
const DebugStatusBadge = ({ datasetId, uiStatus }: DebugStatusBadgeProps) => {
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const [isConsistent, setIsConsistent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('datasets')
          .select('verification_status')
          .eq('id', datasetId)
          .single();
          
        if (error) {
          console.error('Error fetching dataset status:', error);
          return;
        }
        
        const status = data?.verification_status;
        setDbStatus(status);
        setIsConsistent(status === uiStatus);
      } catch (err) {
        console.error('Error checking database status:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (datasetId) {
      checkDatabaseStatus();
    }
  }, [datasetId, uiStatus]);

  if (isLoading) {
    return <Badge variant="outline" className="ml-2 animate-pulse">Checking...</Badge>;
  }
  
  if (!dbStatus) {
    return <Badge variant="destructive" className="ml-2">DB Error</Badge>;
  }
  
  return (
    <Badge 
      variant={isConsistent ? "outline" : "destructive"} 
      className={`ml-2 ${isConsistent ? 'bg-muted' : 'bg-yellow-100 text-yellow-800'}`}
    >
      DB: {dbStatus}
    </Badge>
  );
};

export default DebugStatusBadge;
