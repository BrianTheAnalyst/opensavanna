/**
 * Semantic Query Processing for Enhanced Dataset Matching
 * Handles synonym expansion, intent detection, and semantic similarity
 */

export interface QueryIntent {
  type: 'explore' | 'compare' | 'trend' | 'correlate' | 'distribute' | 'analyze';
  confidence: number;
  keywords: string[];
  synonyms: string[];
  domain: string;
  timeframe?: string;
  geographic?: string;
}

// Comprehensive synonym mappings for Kenya development context
const SEMANTIC_MAPPINGS = {
  // Economics & Finance
  economic: ['economy', 'gdp', 'growth', 'finance', 'financial', 'trade', 'commerce', 'business', 'income', 'revenue', 'earnings'],
  poverty: ['poor', 'low-income', 'disadvantaged', 'underprivileged', 'impoverished', 'deprived'],
  development: ['progress', 'advancement', 'improvement', 'growth', 'expansion', 'modernization'],
  
  // Health & Wellness
  health: ['healthcare', 'medical', 'wellness', 'medicine', 'hospital', 'clinic', 'treatment'],
  disease: ['illness', 'sickness', 'condition', 'infection', 'epidemic', 'outbreak', 'pandemic'],
  mortality: ['death', 'deaths', 'fatality', 'fatalities', 'survival', 'life expectancy'],
  
  // Education & Learning
  education: ['school', 'learning', 'academic', 'university', 'college', 'training', 'knowledge'],
  literacy: ['reading', 'writing', 'numeracy', 'skills', 'competency', 'ability'],
  enrollment: ['admission', 'registration', 'attendance', 'participation'],
  
  // Infrastructure & Transport
  transport: ['transportation', 'mobility', 'travel', 'movement', 'logistics', 'transit'],
  infrastructure: ['roads', 'bridges', 'utilities', 'facilities', 'services', 'amenities'],
  
  // Environment & Climate
  environment: ['environmental', 'climate', 'weather', 'ecology', 'nature', 'sustainability'],
  pollution: ['contamination', 'emissions', 'waste', 'toxic', 'environmental damage'],
  
  // Geographic regions
  kenya: ['kenyan', 'national', 'country'],
  region: ['area', 'zone', 'territory', 'location', 'place', 'county', 'province'],
  county: ['counties', 'devolution', 'local government'],
  
  // Social indicators
  population: ['people', 'demographic', 'citizens', 'residents', 'inhabitants'],
  urban: ['city', 'metropolitan', 'municipal', 'town'],
  rural: ['countryside', 'village', 'remote', 'agricultural']
};

// Time-related keyword detection
const TIME_PATTERNS = {
  trend: ['trend', 'change', 'over time', 'evolution', 'progress', 'development', 'growth', 'decline'],
  recent: ['recent', 'latest', 'current', 'new', 'modern', 'today', 'now'],
  historical: ['historical', 'past', 'previous', 'former', 'old', 'traditional', 'historical'],
  comparative: ['compare', 'comparison', 'versus', 'vs', 'against', 'relative', 'between']
};

// Geographic keyword patterns for Kenya
const GEOGRAPHIC_PATTERNS = {
  cities: ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi', 'kitale', 'garissa', 'kakamega'],
  regions: ['coastal region', 'central region', 'eastern region', 'north eastern region', 'nyanza region', 'rift valley region', 'western region'],
  counties: [
    'nairobi', 'mombasa', 'kwale', 'kilifi', 'tana river', 'lamu', 'taita taveta', 'garissa', 'wajir', 'mandera',
    'marsabit', 'isiolo', 'meru', 'tharaka nithi', 'embu', 'kitui', 'machakos', 'makueni', 'nyandarua', 'nyeri',
    'kirinyaga', 'muranga', 'kiambu', 'turkana', 'west pokot', 'samburu', 'trans nzoia', 'uasin gishu', 'elgeyo marakwet',
    'nandi', 'baringo', 'laikipia', 'nakuru', 'narok', 'kajiado', 'kericho', 'bomet', 'kakamega', 'vihiga', 'bungoma',
    'busia', 'siaya', 'kisumu', 'homa bay', 'migori', 'kisii', 'nyamira'
  ]
};

/**
 * Process natural language query to extract semantic meaning
 */
export const processSemanticQuery = (query: string): QueryIntent => {
  const queryLower = query.toLowerCase().trim();
  
  // Extract base keywords
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 'on', 'at', 
    'for', 'with', 'about', 'between', 'into', 'to', 'from', 'by', 'as', 
    'of', 'show', 'me', 'give', 'what', 'when', 'where', 'which', 'who', 
    'how', 'why', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);
  
  const keywords = queryLower
    .replace(/[.,?!;:(){}[\]]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Detect intent
  const intent = detectQueryIntent(queryLower);
  
  // Expand keywords with synonyms
  const synonyms = expandWithSynonyms(keywords);
  
  // Detect domain
  const domain = detectDomain(queryLower, keywords, synonyms);
  
  // Extract timeframe and geographic context
  const timeframe = extractTimeframe(queryLower);
  const geographic = extractGeographic(queryLower);
  
  return {
    type: intent.type,
    confidence: intent.confidence,
    keywords,
    synonyms,
    domain,
    timeframe,
    geographic
  };
};

/**
 * Detect query intent from natural language patterns
 */
const detectQueryIntent = (query: string): { type: QueryIntent['type'], confidence: number } => {
  const intentPatterns = [
    { type: 'compare' as const, patterns: ['compare', 'versus', 'vs', 'difference', 'between', 'against'], confidence: 0.9 },
    { type: 'trend' as const, patterns: ['trend', 'change', 'over time', 'evolution', 'growth', 'decline', 'increase', 'decrease'], confidence: 0.85 },
    { type: 'correlate' as const, patterns: ['relationship', 'correlation', 'connection', 'related', 'linked', 'associated'], confidence: 0.8 },
    { type: 'distribute' as const, patterns: ['distribution', 'breakdown', 'share', 'proportion', 'percentage', 'split'], confidence: 0.8 },
    { type: 'analyze' as const, patterns: ['analyze', 'analysis', 'study', 'examine', 'investigate', 'research'], confidence: 0.75 },
    { type: 'explore' as const, patterns: ['explore', 'show', 'display', 'view', 'see', 'find'], confidence: 0.7 }
  ];
  
  for (const intentPattern of intentPatterns) {
    for (const pattern of intentPattern.patterns) {
      if (query.includes(pattern)) {
        return { type: intentPattern.type, confidence: intentPattern.confidence };
      }
    }
  }
  
  return { type: 'explore', confidence: 0.6 }; // Default intent
};

/**
 * Expand keywords with semantic synonyms
 */
const expandWithSynonyms = (keywords: string[]): string[] => {
  const expandedSet = new Set(keywords);
  
  keywords.forEach(keyword => {
    // Find semantic mappings
    Object.entries(SEMANTIC_MAPPINGS).forEach(([key, synonyms]) => {
      if (synonyms.includes(keyword) || key === keyword) {
        synonyms.forEach(synonym => expandedSet.add(synonym));
        expandedSet.add(key);
      }
    });
  });
  
  return Array.from(expandedSet);
};

/**
 * Detect the primary domain/category of the query
 */
const detectDomain = (query: string, keywords: string[], synonyms: string[]): string => {
  const domainScores: Record<string, number> = {};
  
  // Score based on direct matches
  Object.entries(SEMANTIC_MAPPINGS).forEach(([domain, relatedTerms]) => {
    let score = 0;
    
    // Direct keyword matches
    keywords.forEach(keyword => {
      if (relatedTerms.includes(keyword) || keyword === domain) {
        score += 3;
      }
    });
    
    // Query contains domain terms
    relatedTerms.forEach(term => {
      if (query.includes(term)) {
        score += 2;
      }
    });
    
    if (score > 0) {
      domainScores[domain] = score;
    }
  });
  
  // Return highest scoring domain or 'general'
  const topDomain = Object.entries(domainScores)
    .sort(([,a], [,b]) => b - a)[0];
  
  return topDomain ? topDomain[0] : 'general';
};

/**
 * Extract timeframe context from query
 */
const extractTimeframe = (query: string): string | undefined => {
  const timeframePatterns = [
    { pattern: /\b(trend|change|over time|evolution)\b/, value: 'temporal' },
    { pattern: /\b(recent|latest|current|new|modern)\b/, value: 'recent' },
    { pattern: /\b(historical|past|previous|former|old|traditional)\b/, value: 'historical' },
    { pattern: /\b(202[0-9]|201[0-9]|year|yearly|annual)\b/, value: 'annual' },
    { pattern: /\b(month|monthly|quarter|quarterly)\b/, value: 'periodic' }
  ];
  
  for (const { pattern, value } of timeframePatterns) {
    if (pattern.test(query)) {
      return value;
    }
  }
  
  return undefined;
};

/**
 * Extract geographic context from query (Kenya-focused)
 */
const extractGeographic = (query: string): string | undefined => {
  // Check for specific cities
  for (const city of GEOGRAPHIC_PATTERNS.cities) {
    if (query.includes(city)) {
      return city;
    }
  }
  
  // Check for regions
  for (const region of GEOGRAPHIC_PATTERNS.regions) {
    if (query.includes(region)) {
      return region;
    }
  }
  
  // Check for counties
  for (const county of GEOGRAPHIC_PATTERNS.counties) {
    if (query.includes(county)) {
      return county;
    }
  }
  
  return undefined;
};

/**
 * Calculate semantic similarity between query and dataset
 */
export const calculateSemanticSimilarity = (
  queryIntent: QueryIntent, 
  dataset: { title: string; description: string; category: string }
): number => {
  let score = 0;
  const queryText = `${queryIntent.keywords.join(' ')} ${queryIntent.synonyms.join(' ')}`.toLowerCase();
  const datasetText = `${dataset.title} ${dataset.description} ${dataset.category}`.toLowerCase();
  
  // Direct keyword matches (highest weight)
  queryIntent.keywords.forEach(keyword => {
    if (datasetText.includes(keyword.toLowerCase())) {
      score += 5;
    }
  });
  
  // Synonym matches (medium weight)
  queryIntent.synonyms.forEach(synonym => {
    if (datasetText.includes(synonym.toLowerCase())) {
      score += 3;
    }
  });
  
  // Domain alignment (high weight)
  if (dataset.category.toLowerCase().includes(queryIntent.domain) || 
      queryIntent.domain === 'general') {
    score += 4;
  }
  
  // Geographic context bonus
  if (queryIntent.geographic && datasetText.includes(queryIntent.geographic)) {
    score += 3;
  }
  
  // Intent-based scoring
  switch (queryIntent.type) {
    case 'trend':
      if (datasetText.includes('time') || datasetText.includes('year') || datasetText.includes('trend')) {
        score += 2;
      }
      break;
    case 'compare':
      if (datasetText.includes('comparison') || datasetText.includes('versus')) {
        score += 2;
      }
      break;
    case 'distribute':
      if (datasetText.includes('distribution') || datasetText.includes('breakdown')) {
        score += 2;
      }
      break;
  }
  
  return Math.min(score, 20); // Cap at 20 for normalization
};