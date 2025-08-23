
import { getDatasets } from "@/services";
import { Dataset } from "@/types/dataset";

import { ConversationContext } from "./conversationContext";

// Extract keywords from a query
export const extractKeywords = (query: string): string[] => {
  // Remove common words and punctuation
  const stopWords = [
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 
    'on', 'at', 'for', 'with', 'about', 'between', 'into', 
    'to', 'from', 'by', 'as', 'of', 'show', 'me', 'give', 
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose',
    'how', 'why', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ];
  
  // Convert to lowercase and split into words
  const words = query.toLowerCase()
    .replace(/[.,?!;:(){}[\]]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Add specific category mapping
  const categoryMappings: Record<string, string[]> = {
    'economic': ['economics', 'economy', 'gdp', 'inflation', 'trade'],
    'health': ['healthcare', 'medical', 'hospital', 'disease', 'patient'],
    'education': ['school', 'university', 'student', 'learning', 'academic'],
    'transport': ['transportation', 'vehicle', 'traffic', 'road', 'travel'],
    'environment': ['environmental', 'climate', 'pollution', 'energy', 'sustainability']
  };
  
  const expandedWords = [...words];
  
  // Add category keywords if related words are found
  Object.entries(categoryMappings).forEach(([category, relatedWords]) => {
    if (relatedWords.some(word => words.includes(word))) {
      expandedWords.push(category);
    }
  });
  
  return [...new Set(expandedWords)]; // Remove duplicates
};

// Find datasets relevant to the user's question
export const findRelevantDatasets = async (
  query: string, 
  context?: ConversationContext
): Promise<Dataset[]> => {
  // Get all datasets
  const allDatasets = await getDatasets();
  
  if (!allDatasets || allDatasets.length === 0) {
    return [];
  }
  
  // Extract keywords from the query
  const keywords = extractKeywords(query);
  
  // Score each dataset for relevance
  const scoredDatasets = allDatasets.map(dataset => {
    const titleScore = keywords.reduce((score, keyword) => {
      return dataset.title.toLowerCase().includes(keyword.toLowerCase()) ? score + 3 : score;
    }, 0);
    
    const descriptionScore = keywords.reduce((score, keyword) => {
      return dataset.description.toLowerCase().includes(keyword.toLowerCase()) ? score + 2 : score;
    }, 0);
    
    const categoryScore = keywords.reduce((score, keyword) => {
      return dataset.category.toLowerCase().includes(keyword.toLowerCase()) ? score + 4 : score;
    }, 0);
    
    // Add context scoring - prioritize datasets from conversation history
    let contextScore = 0;
    if (context?.currentDatasets?.includes(dataset.id)) {
      // Heavily boost datasets that are part of the current conversation
      contextScore += 5;
    } else if (context?.history) {
      // Give some weight to datasets that were part of recent conversation history
      context.history.forEach((historyItem, index) => {
        const recencyWeight = (context.history.length - index) / context.history.length;
        if (historyItem.datasetIds.includes(dataset.id)) {
          contextScore += 2 * recencyWeight;
        }
      });
    }
    
    const totalScore = titleScore + descriptionScore + categoryScore + contextScore;
    
    return {
      dataset,
      score: totalScore
    };
  });
  
  // Sort by relevance score and take top 3
  const relevantDatasets = scoredDatasets
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.dataset);
  
  // If no datasets matched, return featured datasets or most recent ones
  if (relevantDatasets.length === 0) {
    const featuredDatasets = allDatasets.filter(d => d.featured);
    if (featuredDatasets.length > 0) {
      return featuredDatasets.slice(0, 3);
    }
    return allDatasets.slice(0, 3);
  }
  
  return relevantDatasets;
};
