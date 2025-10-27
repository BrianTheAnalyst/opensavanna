
import { Dataset } from "@/types/dataset";
import { getDatasets } from "@/services";
import { ConversationContext } from "./conversationContext";
import { datasetCache } from "./intelligentCache";

interface DatasetScore {
  dataset: Dataset;
  relevanceScore: number;
  matchDetails: {
    titleMatches: string[];
    descriptionMatches: string[];
    categoryRelevance: number;
    contextBoost: number;
    semanticScore: number;
  };
}

// Enhanced keyword extraction with semantic understanding
export const extractEnhancedKeywords = (query: string): { 
  primary: string[], 
  secondary: string[], 
  intent: string,
  domain: string 
} => {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 
    'on', 'at', 'for', 'with', 'about', 'between', 'into', 
    'to', 'from', 'by', 'as', 'of', 'show', 'me', 'give', 
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose',
    'how', 'why', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);

  const queryLower = query.toLowerCase();
  
  // Extract intent
  let intent = 'explore';
  if (queryLower.includes('compare') || queryLower.includes('versus')) intent = 'compare';
  else if (queryLower.includes('trend') || queryLower.includes('change')) intent = 'trend';
  else if (queryLower.includes('correlation') || queryLower.includes('relationship')) intent = 'correlate';
  else if (queryLower.includes('distribution') || queryLower.includes('breakdown')) intent = 'distribute';

  // Domain detection
  let domain = 'general';
  if (queryLower.includes('health') || queryLower.includes('medical')) domain = 'health';
  else if (queryLower.includes('economic') || queryLower.includes('gdp')) domain = 'economics';
  else if (queryLower.includes('education') || queryLower.includes('school')) domain = 'education';
  else if (queryLower.includes('transport') || queryLower.includes('traffic')) domain = 'transport';
  else if (queryLower.includes('environment') || queryLower.includes('climate')) domain = 'environment';

  // Extract keywords
  const words = queryLower
    .replace(/[.,?!;:(){}[\]]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Category-specific keyword expansion
  const categoryMappings: Record<string, string[]> = {
    'economic': ['economics', 'economy', 'gdp', 'inflation', 'trade', 'finance', 'income'],
    'health': ['healthcare', 'medical', 'hospital', 'disease', 'patient', 'mortality', 'wellness'],
    'education': ['school', 'university', 'student', 'learning', 'academic', 'literacy', 'enrollment'],
    'transport': ['transportation', 'vehicle', 'traffic', 'road', 'travel', 'mobility', 'logistics'],
    'environment': ['environmental', 'climate', 'pollution', 'energy', 'sustainability', 'emissions']
  };

  const expandedWords = [...words];
  Object.entries(categoryMappings).forEach(([category, relatedWords]) => {
    if (relatedWords.some(word => words.includes(word))) {
      expandedWords.push(category);
    }
  });

  // Separate primary (high importance) and secondary (contextual) keywords
  const primary = expandedWords.filter(word => 
    query.toLowerCase().indexOf(word) < query.length / 2 || 
    categoryMappings[domain]?.includes(word)
  );
  
  const secondary = expandedWords.filter(word => !primary.includes(word));

  return {
    primary: [...new Set(primary)],
    secondary: [...new Set(secondary)],
    intent,
    domain
  };
};

// Enhanced domain scoring with better category matching
const calculateDomainScore = (dataset: Dataset, keywords: any): number => {
  let score = 0;
  const categoryLower = dataset.category.toLowerCase();
  const titleLower = dataset.title.toLowerCase();
  const descLower = dataset.description.toLowerCase();
  
  // Direct domain match in category (highest priority)
  if (categoryLower === keywords.domain || categoryLower.includes(keywords.domain)) {
    score += 8;
  }
  
  // Domain-related keywords in title/description
  const domainKeywords = categoryMappings[keywords.domain] || [];
  domainKeywords.forEach(keyword => {
    if (titleLower.includes(keyword)) score += 3;
    if (descLower.includes(keyword)) score += 2;
  });
  
  return score;
};

// Enhanced intent alignment scoring
const calculateIntentScore = (dataset: Dataset, keywords: any): number => {
  let score = 0;
  const titleLower = dataset.title.toLowerCase();
  const descLower = dataset.description.toLowerCase();
  
  // Intent-specific scoring
  switch (keywords.intent) {
    case 'compare':
      // Look for datasets with comparative or multi-category data
      if (titleLower.includes('comparison') || descLower.includes('versus') || 
          descLower.includes('compare') || titleLower.includes('vs')) score += 4;
      break;
    case 'trend':
      // Look for time-series or historical data
      if (titleLower.includes('trend') || titleLower.includes('historical') ||
          descLower.includes('over time') || descLower.includes('yearly')) score += 4;
      break;
    case 'correlate':
      // Look for datasets mentioning relationships or multiple factors
      if (descLower.includes('relationship') || descLower.includes('correlation') ||
          descLower.includes('impact') || descLower.includes('effect')) score += 4;
      break;
    case 'distribute':
      // Look for datasets with distribution or breakdown data
      if (titleLower.includes('distribution') || descLower.includes('breakdown') ||
          descLower.includes('by region') || descLower.includes('by category')) score += 4;
      break;
  }
  
  return score;
};

// Calculate semantic relevance score with enhanced domain and intent alignment
const calculateSemanticScore = (dataset: Dataset, keywords: any): number => {
  let score = 0;
  
  // Exact matches get highest score
  keywords.primary.forEach((keyword: string) => {
    if (dataset.title.toLowerCase().includes(keyword)) score += 5;
    if (dataset.description.toLowerCase().includes(keyword)) score += 3;
    if (dataset.category.toLowerCase().includes(keyword)) score += 4;
  });

  // Secondary keywords get moderate score
  keywords.secondary.forEach((keyword: string) => {
    if (dataset.title.toLowerCase().includes(keyword)) score += 2;
    if (dataset.description.toLowerCase().includes(keyword)) score += 1;
  });

  return score;
};

// Category mappings for domain scoring
const categoryMappings: Record<string, string[]> = {
  'health': ['healthcare', 'medical', 'hospital', 'disease', 'patient', 'mortality', 'wellness'],
  'economics': ['economy', 'gdp', 'inflation', 'trade', 'finance', 'income', 'employment'],
  'education': ['school', 'university', 'student', 'learning', 'academic', 'literacy', 'enrollment'],
  'transport': ['transportation', 'vehicle', 'traffic', 'road', 'travel', 'mobility', 'logistics'],
  'environment': ['environmental', 'climate', 'pollution', 'energy', 'sustainability', 'emissions']
};

// Enhanced dataset finding with intelligent scoring
export const findRelevantDatasetsIntelligent = async (
  query: string, 
  context?: ConversationContext
): Promise<Dataset[]> => {
  // Check cache first
  const cacheKey = `datasets:${query}`;
  const cached = datasetCache.get(cacheKey, { context: context?.currentDatasets });
  if (cached && Array.isArray(cached)) {
    return cached as Dataset[];
  }

  // Get all datasets
  const allDatasets = await getDatasets();
  if (!allDatasets || allDatasets.length === 0) {
    return [];
  }

  // Extract enhanced keywords and intent
  const keywords = extractEnhancedKeywords(query);
  
  // Score each dataset
  const scoredDatasets: DatasetScore[] = allDatasets.map(dataset => {
    const titleMatches: string[] = [];
    const descriptionMatches: string[] = [];
    
    // Find specific matches
    [...keywords.primary, ...keywords.secondary].forEach(keyword => {
      if (dataset.title.toLowerCase().includes(keyword.toLowerCase())) {
        titleMatches.push(keyword);
      }
      if (dataset.description.toLowerCase().includes(keyword.toLowerCase())) {
        descriptionMatches.push(keyword);
      }
    });

    // Calculate enhanced domain and intent scores
    const domainScore = calculateDomainScore(dataset, keywords);
    const intentScore = calculateIntentScore(dataset, keywords);

    // Context boost from conversation history
    let contextBoost = 0;
    if (context?.currentDatasets?.includes(dataset.id)) {
      contextBoost += 5; // High boost for current conversation datasets
    } else if (context?.history) {
      context.history.forEach((historyItem, index) => {
        const recencyWeight = (context.history.length - index) / context.history.length;
        if (historyItem.datasetIds.includes(dataset.id)) {
          contextBoost += 2 * recencyWeight;
        }
      });
    }

    // Calculate semantic score
    const semanticScore = calculateSemanticScore(dataset, keywords);

    // Calculate total relevance score with enhanced domain and intent alignment
    const relevanceScore = 
      titleMatches.length * 3 +
      descriptionMatches.length * 2 +
      domainScore +              // Enhanced domain scoring
      intentScore +              // New intent alignment scoring
      contextBoost +
      semanticScore +
      (dataset.featured ? 1 : 0); // Small boost for featured datasets

    return {
      dataset,
      relevanceScore,
      matchDetails: {
        titleMatches,
        descriptionMatches,
        categoryRelevance: domainScore, // Now using enhanced domain score
        contextBoost,
        semanticScore
      }
    };
  });

  // STRICT: Require meaningful relevance (minimum score of 10 and semantic score > 3)
  const relevantDatasets = scoredDatasets
    .filter(item => item.relevanceScore >= 10 && item.matchDetails.semanticScore > 3)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)
    .map(item => item.dataset);

  // NO FALLBACK - If no relevant datasets found, return empty array
  // This prevents showing irrelevant data to users

  // Cache the results
  datasetCache.set(cacheKey, relevantDatasets, { context: context?.currentDatasets });
  return relevantDatasets;
};
