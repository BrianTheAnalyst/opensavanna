
import { getDatasets } from "@/services";
import { Dataset } from "@/types/dataset";

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
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 'on', 'at',
    'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'out',
    'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
    'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren',
    'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn',
    'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
    'show', 'me', 'give', 'what', 'which', 'who', 'whom', 'whose', 'i',
    'you', 'he', 'she', 'it', 'we', 'they'
  ]);

  const stemmingMap: Record<string, string> = {
    'running': 'run',
    'runs': 'run',
    'ran': 'run',
    'studies': 'study',
    'studying': 'study',
    'countries': 'country',
    'cities': 'city',
    'development': 'develop',
    'developing': 'develop',
    'developed': 'develop',
  };

  const queryLower = query.toLowerCase();
  
  // Extract intent
  let intent = 'explore';
  if (queryLower.includes('compare') || queryLower.includes('versus')) intent = 'compare';
  else if (queryLower.includes('trend') || queryLower.includes('change')) intent = 'trend';
  else if (queryLower.includes('correlation') || queryLower.includes('relationship')) intent = 'correlate';
  else if (queryLower.includes('distribution') || queryLower.includes('breakdown')) intent = 'distribute';

  // Domain detection
  let domain = 'general';
  if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('disease')) domain = 'health';
  else if (queryLower.includes('economic') || queryLower.includes('gdp') || queryLower.includes('finance')) domain = 'economics';
  else if (queryLower.includes('education') || queryLower.includes('school') || queryLower.includes('student')) domain = 'education';
  else if (queryLower.includes('transport') || queryLower.includes('traffic') || queryLower.includes('travel')) domain = 'transport';
  else if (queryLower.includes('environment') || queryLower.includes('climate') || queryLower.includes('pollution')) domain = 'environment';

  // Extract and stem keywords
  const words = queryLower
    .replace(/[.,?!;:(){}[\]]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .map(word => stemmingMap[word] || word);

  // Category-specific keyword expansion
  const categoryMappings: Record<string, string[]> = {
    'economics': ['economics', 'economy', 'gdp', 'inflation', 'trade', 'finance', 'income', 'market'],
    'health': ['healthcare', 'medical', 'hospital', 'disease', 'patient', 'mortality', 'wellness', 'life expectancy'],
    'education': ['school', 'university', 'student', 'learning', 'academic', 'literacy', 'enrollment', 'graduation rate'],
    'transport': ['transportation', 'vehicle', 'traffic', 'road', 'travel', 'mobility', 'logistics', 'commute'],
    'environment': ['environmental', 'climate', 'pollution', 'energy', 'sustainability', 'emissions', 'global warming']
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
    (categoryMappings[domain] && categoryMappings[domain].includes(word))
  );
  
  const secondary = expandedWords.filter(word => !primary.includes(word));

  return {
    primary: [...new Set(primary)],
    secondary: [...new Set(secondary)],
    intent,
    domain
  };
};

// Calculate semantic relevance score
const calculateSemanticScore = (dataset: Dataset, keywords: any): number => {
  let score = 0;
  const title = dataset.title.toLowerCase();
  const description = dataset.description.toLowerCase();
  const category = dataset.category.toLowerCase();

  // Exact matches get highest score
  keywords.primary.forEach((keyword: string) => {
    if (title.includes(keyword)) score += 10;
    if (description.includes(keyword)) score += 2; // Lower score for description
    if (category.includes(keyword)) score += 8;
  });

  // Secondary keywords get moderate score
  keywords.secondary.forEach((keyword: string) => {
    if (title.includes(keyword)) score += 5;
    if (description.includes(keyword)) score += 1;
  });

  // Domain alignment
  if (category.includes(keywords.domain)) {
    score += 5;
  } else {
    // Penalty for domain mismatch
    score -= 5;
  }

  return score;
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
  let scoredDatasets: DatasetScore[] = allDatasets.map(dataset => {
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

    // Calculate category relevance
    const categoryRelevance = category.toLowerCase().includes(keywords.domain) ? 5 :
                             keywords.primary.some(k => category.toLowerCase().includes(k.toLowerCase())) ? 3 :
                             0; // No points for secondary keyword match in category

    // Context boost from conversation history
    let contextBoost = 0;
    if (context?.currentDatasets?.includes(dataset.id)) {
      contextBoost += 10; // High boost for current conversation datasets
    } else if (context?.history) {
      context.history.forEach((historyItem, index) => {
        const recencyWeight = (context.history.length - index) / context.history.length;
        if (historyItem.datasetIds.includes(dataset.id)) {
          contextBoost += 3 * recencyWeight;
        }
      });
    }

    // Calculate semantic score
    const semanticScore = calculateSemanticScore(dataset, keywords);

    // Calculate total relevance score
    const relevanceScore = 
      titleMatches.length * 5 + // Increased weight for title
      descriptionMatches.length * 1 + // Decreased weight for description
      categoryRelevance +
      contextBoost +
      semanticScore +
      (dataset.featured ? 2 : 0); // Slightly higher boost for featured

    return {
      dataset,
      relevanceScore,
      matchDetails: {
        titleMatches,
        descriptionMatches,
        categoryRelevance,
        contextBoost,
        semanticScore
      }
    };
  });

  // Normalize scores
  const maxScore = Math.max(...scoredDatasets.map(d => d.relevanceScore));
  if (maxScore > 0) {
    scoredDatasets = scoredDatasets.map(d => ({
      ...d,
      relevanceScore: d.relevanceScore / maxScore * 100
    }));
  }

  // Sort by relevance and take top results
  const relevantDatasets = scoredDatasets
    .filter(item => item.relevanceScore > 20) // Increased threshold
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)
    .map(item => item.dataset);

  // Cache the results
  datasetCache.set(cacheKey, relevantDatasets, { context: context?.currentDatasets });
  return relevantDatasets;
};
