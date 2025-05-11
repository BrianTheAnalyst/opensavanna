
import { DatasetWithEmail, AIAnalysis } from '@/types/dataset';

// Transform API response to typed datasets with emails
export const transformDatasetResponse = (data: any[]): DatasetWithEmail[] => {
  return data.map(item => {
    // Safely extract email from the users object
    const email = item.users && typeof item.users === 'object' && 'email' in item.users 
      ? String(item.users.email) 
      : null;
      
    // Parse aiAnalysis if it exists
    let parsedAiAnalysis: AIAnalysis | undefined = undefined;
    if (item.aiAnalysis) {
      try {
        // Safe parsing of aiAnalysis
        if (typeof item.aiAnalysis === 'object') {
          parsedAiAnalysis = item.aiAnalysis as AIAnalysis;
        } else if (typeof item.aiAnalysis === 'string') {
          parsedAiAnalysis = JSON.parse(item.aiAnalysis);
        }
      } catch (e) {
        console.error("Error parsing aiAnalysis:", e);
      }
    }
    
    // Create a properly typed dataset object directly without relying on TypeScript inference
    const dataset: DatasetWithEmail = {
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      format: item.format || '',
      country: item.country || '',
      date: item.date || '',
      email,
      downloads: typeof item.downloads === 'number' ? item.downloads : 0,
      verificationStatus: item.verificationStatus || 'pending',
      verified: item.verified ?? false,
      verificationNotes: item.verificationNotes || '',
      verifiedAt: item.verifiedAt || null,
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
      user_id: item.user_id || null,
      file: item.file || null,
      fileSize: item.fileSize || null,
      license: item.license || null,
      dataPoints: item.dataPoints || null,
      timespan: item.timespan || null,
      source: item.source || null,
      tags: Array.isArray(item.tags) ? item.tags : [],
      dataFields: Array.isArray(item.dataFields) ? item.dataFields : [],
      // Only add aiAnalysis if it was successfully parsed
      ...(parsedAiAnalysis ? { aiAnalysis: parsedAiAnalysis } : {})
    };
    
    return dataset;
  });
};
