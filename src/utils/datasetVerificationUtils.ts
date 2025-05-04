
import { DatasetWithEmail, AIAnalysis } from '@/types/dataset';

// Transform API response to typed datasets with emails
export const transformDatasetResponse = (data: any[]): DatasetWithEmail[] => {
  return data.map(item => {
    // Safely extract email from the users object
    const email = item.users && typeof item.users === 'object' && 'email' in item.users 
      ? String(item.users.email) 
      : 'Unknown';
      
    // Parse aiAnalysis if it exists
    let parsedAiAnalysis: AIAnalysis | undefined = undefined;
    if (item.aiAnalysis) {
      try {
        // Use type assertion without additional processing
        parsedAiAnalysis = item.aiAnalysis as AIAnalysis;
      } catch (e) {
        console.error("Error parsing aiAnalysis:", e);
      }
    }
    
    // Create a properly typed dataset with email
    const dataset: DatasetWithEmail = {
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      format: item.format || '',
      country: item.country || '',
      date: item.date || '',
      email,
      aiAnalysis: parsedAiAnalysis,
      // Ensure required properties have default values if they're missing
      verificationStatus: item.verificationStatus || 'pending',
      downloads: typeof item.downloads === 'number' ? item.downloads : 0,
      // Copy remaining properties
      ...item,
    };
    
    return dataset;
  });
};
