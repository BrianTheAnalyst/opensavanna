
import { supabase } from "@/integrations/supabase/client";
import { Dataset, AIAnalysis } from "@/types/dataset";
import { toast } from "sonner";

// Process dataset with AI
export const processDatasetWithAI = async (datasetId: string): Promise<boolean> => {
  try {
    // Call the Supabase edge function to process the dataset
    const { data, error } = await supabase.functions.invoke('process-dataset-ai', {
      body: { datasetId }
    });

    if (error) {
      console.error('Error processing dataset with AI:', error);
      toast.error('Failed to process dataset with AI');
      return false;
    }

    toast.success('Dataset processed successfully by AI');
    return true;
  } catch (error) {
    console.error('Error in AI processing:', error);
    toast.error('AI processing failed');
    return false;
  }
};

// Get AI insights for a specific dataset
export const getDatasetAIInsights = async (datasetId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('aiAnalysis')
      .eq('id', datasetId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching AI insights:', error);
      return [];
    }

    // Safely access aiAnalysis and its insights property
    if (data?.aiAnalysis && typeof data.aiAnalysis === 'object') {
      const analysis = data.aiAnalysis as AIAnalysis;
      return analysis.insights || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return [];
  }
};

// Ask a question about a dataset
export const askQuestionAboutDataset = async (
  datasetId: string, 
  question: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('dataset-qa', {
      body: { datasetId, question }
    });

    if (error) {
      console.error('Error asking question about dataset:', error);
      throw new Error(error.message);
    }

    return data?.answer || 'No answer found';
  } catch (error) {
    console.error('Error in dataset QA:', error);
    throw error;
  }
};

// Get AI answer for a general data question
export const getAIAnswerForQuestion = async (question: string): Promise<{
  answer: string;
  sources: Array<{ datasetId: string; title: string; relevance: number }>
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('answer-data-question', {
      body: { question }
    });

    if (error) {
      console.error('Error getting AI answer:', error);
      throw new Error(error.message);
    }

    return data || { answer: 'No answer found', sources: [] };
  } catch (error) {
    console.error('Error in AI QA:', error);
    throw error;
  }
};
