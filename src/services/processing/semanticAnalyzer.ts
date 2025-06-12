
import { InferredSchema, FieldSchema } from './schemaInferenceEngine';

// Semantic analysis and knowledge linking
export interface SemanticAnalysis {
  domainClassification: string;
  knowledgeLinks: KnowledgeLink[];
  suggestedAnalyses: string[];
  dataQualityScore: number;
  completenessScore: number;
  consistencyScore: number;
}

export interface KnowledgeLink {
  field: string;
  externalSource: string;
  linkType: 'exact_match' | 'semantic_match' | 'suggested';
  confidence: number;
  description: string;
}

// Domain classification based on field patterns
const DOMAIN_PATTERNS = {
  finance: ['price', 'cost', 'revenue', 'profit', 'amount', 'payment', 'balance', 'investment'],
  healthcare: ['patient', 'diagnosis', 'treatment', 'medical', 'hospital', 'doctor', 'symptom'],
  retail: ['product', 'customer', 'order', 'purchase', 'inventory', 'sales', 'item'],
  education: ['student', 'course', 'grade', 'school', 'teacher', 'enrollment', 'academic'],
  transportation: ['vehicle', 'route', 'traffic', 'distance', 'speed', 'transport', 'logistics'],
  government: ['population', 'census', 'policy', 'public', 'citizen', 'municipal', 'federal'],
  environment: ['temperature', 'pollution', 'emissions', 'energy', 'climate', 'environmental']
};

export const analyzeSemantics = (schema: InferredSchema, data: any[]): SemanticAnalysis => {
  const domainClassification = classifyDomain(schema);
  const knowledgeLinks = findKnowledgeLinks(schema);
  const suggestedAnalyses = generateAnalysisSuggestions(schema, domainClassification);
  const dataQualityScore = calculateDataQuality(schema, data);
  const completenessScore = calculateCompleteness(schema, data);
  const consistencyScore = calculateConsistency(schema, data);

  return {
    domainClassification,
    knowledgeLinks,
    suggestedAnalyses,
    dataQualityScore,
    completenessScore,
    consistencyScore
  };
};

const classifyDomain = (schema: InferredSchema): string => {
  const fieldNames = schema.fields.map(f => f.name.toLowerCase()).join(' ');
  const semanticTypes = schema.fields.map(f => f.semanticType).join(' ');
  const text = `${fieldNames} ${semanticTypes}`;

  let maxScore = 0;
  let bestDomain = 'general';

  Object.entries(DOMAIN_PATTERNS).forEach(([domain, keywords]) => {
    const score = keywords.reduce((sum, keyword) => {
      return sum + (text.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  });

  return bestDomain;
};

const findKnowledgeLinks = (schema: InferredSchema): KnowledgeLink[] => {
  const links: KnowledgeLink[] = [];

  schema.fields.forEach(field => {
    // Geographic field linking
    if (field.dataType === 'geographic') {
      if (field.name.toLowerCase().includes('country')) {
        links.push({
          field: field.name,
          externalSource: 'ISO 3166 Country Codes',
          linkType: 'exact_match',
          confidence: 0.9,
          description: 'Standard country codes and names'
        });
      }
      
      if (field.name.toLowerCase().includes('city')) {
        links.push({
          field: field.name,
          externalSource: 'GeoNames Database',
          linkType: 'semantic_match',
          confidence: 0.8,
          description: 'Global city and place names'
        });
      }
    }

    // Currency and economic indicators
    if (field.semanticType === 'metric' && 
        (field.name.toLowerCase().includes('gdp') || 
         field.name.toLowerCase().includes('inflation'))) {
      links.push({
        field: field.name,
        externalSource: 'World Bank Open Data',
        linkType: 'semantic_match',
        confidence: 0.85,
        description: 'Economic indicators and statistics'
      });
    }

    // Industry classifications
    if (field.name.toLowerCase().includes('industry') || 
        field.name.toLowerCase().includes('sector')) {
      links.push({
        field: field.name,
        externalSource: 'NAICS Industry Codes',
        linkType: 'suggested',
        confidence: 0.7,
        description: 'Standard industry classification codes'
      });
    }
  });

  return links;
};

const generateAnalysisSuggestions = (schema: InferredSchema, domain: string): string[] => {
  const suggestions: string[] = [];

  // Temporal analysis suggestions
  if (schema.temporalFields.length > 0) {
    suggestions.push('Time series analysis to identify trends and seasonality');
    suggestions.push('Year-over-year growth analysis');
  }

  // Geographic analysis suggestions
  if (schema.geographicFields.length > 0) {
    suggestions.push('Geographic distribution analysis and mapping');
    suggestions.push('Regional comparison analysis');
  }

  // Correlation analysis for multiple metrics
  if (schema.metricFields.length > 1) {
    suggestions.push('Correlation analysis between key metrics');
    suggestions.push('Multi-variate regression analysis');
  }

  // Domain-specific suggestions
  switch (domain) {
    case 'finance':
      suggestions.push('Financial ratio analysis');
      suggestions.push('Risk assessment based on financial indicators');
      break;
    case 'retail':
      suggestions.push('Customer segmentation analysis');
      suggestions.push('Product performance analysis');
      break;
    case 'healthcare':
      suggestions.push('Patient outcome analysis');
      suggestions.push('Treatment effectiveness comparison');
      break;
    case 'education':
      suggestions.push('Academic performance trend analysis');
      suggestions.push('Student success factor analysis');
      break;
  }

  // Relationship analysis
  if (schema.relationships.length > 0) {
    suggestions.push('Field relationship analysis');
    suggestions.push('Dependency mapping between variables');
  }

  return suggestions.slice(0, 8); // Limit to top 8 suggestions
};

const calculateDataQuality = (schema: InferredSchema, data: any[]): number => {
  let qualityScore = 0;
  let totalChecks = 0;

  schema.fields.forEach(field => {
    const fieldData = data.map(row => row[field.name]);
    
    // Check for null values
    const nullRatio = fieldData.filter(val => val == null).length / fieldData.length;
    qualityScore += (1 - nullRatio) * 20; // Max 20 points per field
    totalChecks += 20;

    // Check for data type consistency
    if (field.confidence > 0.8) {
      qualityScore += 15; // Bonus for consistent typing
    }
    totalChecks += 15;

    // Check for outliers in numeric fields
    if (field.dataType === 'numeric' && field.metadata.distribution) {
      const outlierRatio = detectOutliers(fieldData).length / fieldData.length;
      qualityScore += (1 - outlierRatio) * 10;
      totalChecks += 10;
    }
  });

  return totalChecks > 0 ? (qualityScore / totalChecks) * 100 : 0;
};

const calculateCompleteness = (schema: InferredSchema, data: any[]): number => {
  const totalFields = schema.fields.length;
  let completenessScore = 0;

  schema.fields.forEach(field => {
    const fieldData = data.map(row => row[field.name]);
    const nonNullRatio = fieldData.filter(val => val != null).length / fieldData.length;
    completenessScore += nonNullRatio;
  });

  return totalFields > 0 ? (completenessScore / totalFields) * 100 : 0;
};

const calculateConsistency = (schema: InferredSchema, data: any[]): number => {
  let consistencyScore = 0;
  let totalChecks = 0;

  schema.fields.forEach(field => {
    const fieldData = data.map(row => row[field.name]).filter(val => val != null);
    
    if (field.dataType === 'categorical') {
      // Check for consistent formatting
      const stringValues = fieldData.map(v => String(v));
      const hasConsistentCase = stringValues.every(v => v === v.toLowerCase()) ||
                               stringValues.every(v => v === v.toUpperCase());
      if (hasConsistentCase) consistencyScore += 1;
      totalChecks += 1;
    }

    if (field.dataType === 'temporal') {
      // Check for consistent date formats
      const dateFormats = fieldData.map(detectDateFormat);
      const uniqueFormats = new Set(dateFormats);
      if (uniqueFormats.size === 1) consistencyScore += 1;
      totalChecks += 1;
    }
  });

  return totalChecks > 0 ? (consistencyScore / totalChecks) * 100 : 100;
};

// Helper functions
const detectOutliers = (values: any[]): any[] => {
  const numericValues = values.filter(v => !isNaN(Number(v))).map(v => Number(v));
  if (numericValues.length < 4) return [];

  const sorted = numericValues.sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return numericValues.filter(v => v < lowerBound || v > upperBound);
};

const detectDateFormat = (value: any): string => {
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return 'ISO';
  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) return 'US';
  if (/^\d{2}-\d{2}-\d{4}/.test(str)) return 'EU';
  return 'unknown';
};
