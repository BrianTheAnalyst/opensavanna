
import { useState, useEffect, useCallback } from 'react';
import { Dataset } from '@/types/dataset';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseDatasetDetailProps {
  id?: string;
  datasetProp?: Dataset;
}

export function useDatasetDetail({ id, datasetProp }: UseDatasetDetailProps) {
  const [dataset, setDataset] = useState<Dataset | null>(datasetProp || null);
  const [processedFileData, setProcessedFileData] = useState<any>(null);
  const [isLoadingProcessedData, setIsLoadingProcessedData] = useState(false);
  
  // Fetch processed file data when dataset is loaded
  const fetchProcessedFileData = useCallback(async () => {
    if (!dataset?.id) return;
    
    try {
      setIsLoadingProcessedData(true);
      const { data, error } = await supabase
        .from('processed_files')
        .select('*')
        .eq('storage_path', `${dataset.id}/%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Error fetching processed file data:', error);
        return;
      }
        
      if (data && data.length > 0) {
        setProcessedFileData(data[0]);
      }
    } catch (err) {
      console.error('Error fetching processed file data:', err);
    } finally {
      setIsLoadingProcessedData(false);
    }
  }, [dataset?.id]);
  
  useEffect(() => {
    fetchProcessedFileData();
  }, [fetchProcessedFileData]);
  
  return {
    dataset,
    processedFileData,
    isLoadingProcessedData
  };
}
