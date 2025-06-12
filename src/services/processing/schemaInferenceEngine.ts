
import { generateDataSummary } from './statisticsUtils';

// Enhanced schema inference with semantic understanding
export interface InferredSchema {
  fields: FieldSchema[];
  entityType: string;
  temporalFields: string[];
  geographicFields: string[];
  dimensionFields: string[];
  metricFields: string[];
  relationships: FieldRelationship[];
  confidence: number;
}

export interface FieldSchema {
  name: string;
  dataType: 'numeric' | 'categorical' | 'temporal' | 'geographic' | 'text' | 'boolean';
  semanticType: string;
  role: 'dimension' | 'metric' | 'identifier' | 'descriptor';
  patterns: string[];
  examples: any[];
  confidence: number;
  metadata: {
    isUnique: boolean;
    hasNulls: boolean;
    cardinality: number;
    distribution?: any;
  };
}

export interface FieldRelationship {
  sourceField: string;
  targetField: string;
  relationshipType: 'hierarchy' | 'correlation' | 'dependency' | 'composition';
  strength: number;
}

// Semantic patterns for field recognition
const SEMANTIC_PATTERNS = {
  temporal: {
    patterns: [/date/i, /time/i, /year/i, /month/i, /day/i, /created/i, /updated/i, /timestamp/i],
    values: [/^\d{4}-\d{2}-\d{2}/, /^\d{2}\/\d{2}\/\d{4}/, /^\d{4}$/]
  },
  geographic: {
    patterns: [/country/i, /city/i, /state/i, /region/i, /location/i, /address/i, /lat/i, /lng/i, /longitude/i, /latitude/i],
    values: []
  },
  identifier: {
    patterns: [/id$/i, /^id/i, /key$/i, /code$/i, /number$/i],
    values: []
  },
  metric: {
    patterns: [/count/i, /total/i, /amount/i, /value/i, /price/i, /cost/i, /revenue/i, /profit/i, /rate/i, /score/i, /percentage/i],
    values: []
  },
  demographic: {
    patterns: [/age/i, /gender/i, /income/i, /education/i, /population/i],
    values: []
  }
};

// Enhanced schema inference function
export const inferDatasetSchema = (data: any[]): InferredSchema => {
  if (!data || data.length === 0) {
    return {
      fields: [],
      entityType: 'unknown',
      temporalFields: [],
      geographicFields: [],
      dimensionFields: [],
      metricFields: [],
      relationships: [],
      confidence: 0
    };
  }

  const summary = generateDataSummary(data);
  const fields = Object.keys(data[0]);
  const inferredFields: FieldSchema[] = [];

  // Analyze each field
  fields.forEach(fieldName => {
    const fieldData = data.map(row => row[fieldName]).filter(val => val != null);
    const dataType = inferDataType(fieldData);
    const semanticType = inferSemanticType(fieldName, fieldData);
    const role = inferFieldRole(fieldName, dataType, semanticType, fieldData);

    inferredFields.push({
      name: fieldName,
      dataType,
      semanticType,
      role,
      patterns: detectPatterns(fieldData),
      examples: fieldData.slice(0, 5),
      confidence: calculateFieldConfidence(fieldName, fieldData, dataType, semanticType),
      metadata: {
        isUnique: new Set(fieldData).size === fieldData.length,
        hasNulls: data.some(row => row[fieldName] == null),
        cardinality: new Set(fieldData).size,
        distribution: dataType === 'numeric' ? calculateDistribution(fieldData) : null
      }
    });
  });

  // Infer entity type based on field patterns
  const entityType = inferEntityType(inferredFields);

  // Categorize fields by type
  const temporalFields = inferredFields.filter(f => f.dataType === 'temporal').map(f => f.name);
  const geographicFields = inferredFields.filter(f => f.dataType === 'geographic').map(f => f.name);
  const dimensionFields = inferredFields.filter(f => f.role === 'dimension').map(f => f.name);
  const metricFields = inferredFields.filter(f => f.role === 'metric').map(f => f.name);

  // Detect relationships between fields
  const relationships = detectFieldRelationships(inferredFields, data);

  // Calculate overall confidence
  const confidence = inferredFields.reduce((sum, field) => sum + field.confidence, 0) / inferredFields.length;

  return {
    fields: inferredFields,
    entityType,
    temporalFields,
    geographicFields,
    dimensionFields,
    metricFields,
    relationships,
    confidence
  };
};

// Data type inference
const inferDataType = (values: any[]): FieldSchema['dataType'] => {
  if (values.length === 0) return 'text';

  const numericCount = values.filter(v => !isNaN(Number(v)) && typeof v === 'number').length;
  const dateCount = values.filter(v => isValidDate(v)).length;
  const booleanCount = values.filter(v => typeof v === 'boolean' || /^(true|false|yes|no|1|0)$/i.test(String(v))).length;

  const total = values.length;
  
  if (dateCount / total > 0.7) return 'temporal';
  if (numericCount / total > 0.8) return 'numeric';
  if (booleanCount / total > 0.8) return 'boolean';
  
  // Check for geographic patterns
  const geoCount = values.filter(v => isGeographicValue(String(v))).length;
  if (geoCount / total > 0.5) return 'geographic';

  // Check uniqueness for categorical vs text
  const uniqueRatio = new Set(values).size / values.length;
  if (uniqueRatio < 0.1) return 'categorical';
  
  return 'text';
};

// Semantic type inference
const inferSemanticType = (fieldName: string, values: any[]): string => {
  // Check field name patterns
  for (const [type, config] of Object.entries(SEMANTIC_PATTERNS)) {
    if (config.patterns.some(pattern => pattern.test(fieldName))) {
      return type;
    }
  }

  // Check value patterns
  const sampleValues = values.slice(0, 100);
  if (sampleValues.every(v => /^\d+$/.test(String(v)))) return 'identifier';
  if (sampleValues.some(v => /@/.test(String(v)))) return 'email';
  if (sampleValues.some(v => /^https?:\/\//.test(String(v)))) return 'url';
  
  return 'general';
};

// Field role inference
const inferFieldRole = (
  fieldName: string, 
  dataType: FieldSchema['dataType'], 
  semanticType: string, 
  values: any[]
): FieldSchema['role'] => {
  if (semanticType === 'identifier' || fieldName.toLowerCase().includes('id')) {
    return 'identifier';
  }
  
  if (dataType === 'numeric' && semanticType === 'metric') {
    return 'metric';
  }
  
  if (dataType === 'categorical' || dataType === 'geographic' || dataType === 'temporal') {
    return 'dimension';
  }
  
  return 'descriptor';
};

// Helper functions
const isValidDate = (value: any): boolean => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const isGeographicValue = (value: string): boolean => {
  // Simple geographic detection - could be enhanced with external APIs
  const geoPatterns = [
    /^[A-Z]{2}$/, // Country codes
    /^\d+\.\d+,-?\d+\.\d+$/, // Coordinates
    /\b(street|road|avenue|boulevard|city|town|state|country)\b/i
  ];
  return geoPatterns.some(pattern => pattern.test(value));
};

const detectPatterns = (values: any[]): string[] => {
  const patterns: string[] = [];
  const sampleValues = values.slice(0, 50).map(v => String(v));
  
  // Common patterns
  if (sampleValues.every(v => /^\d+$/.test(v))) patterns.push('integer');
  if (sampleValues.every(v => /^\d+\.\d+$/.test(v))) patterns.push('decimal');
  if (sampleValues.every(v => /^[A-Z]{2,3}$/.test(v))) patterns.push('code');
  if (sampleValues.some(v => /@/.test(v))) patterns.push('email');
  
  return patterns;
};

const calculateFieldConfidence = (
  fieldName: string, 
  values: any[], 
  dataType: FieldSchema['dataType'], 
  semanticType: string
): number => {
  let confidence = 0.5; // Base confidence
  
  // Boost confidence for clear patterns
  if (semanticType !== 'general') confidence += 0.2;
  if (fieldName.toLowerCase().includes(semanticType)) confidence += 0.2;
  if (values.length > 100) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
};

const calculateDistribution = (values: number[]): any => {
  const sorted = values.sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const median = sorted[Math.floor(sorted.length * 0.5)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  
  return { q1, median, q3, min: sorted[0], max: sorted[sorted.length - 1] };
};

const inferEntityType = (fields: FieldSchema[]): string => {
  const fieldNames = fields.map(f => f.name.toLowerCase());
  
  if (fieldNames.some(name => name.includes('customer') || name.includes('user'))) return 'customer';
  if (fieldNames.some(name => name.includes('product') || name.includes('item'))) return 'product';
  if (fieldNames.some(name => name.includes('transaction') || name.includes('order'))) return 'transaction';
  if (fieldNames.some(name => name.includes('employee') || name.includes('staff'))) return 'employee';
  if (fieldNames.some(name => name.includes('location') || name.includes('place'))) return 'location';
  
  return 'entity';
};

const detectFieldRelationships = (fields: FieldSchema[], data: any[]): FieldRelationship[] => {
  const relationships: FieldRelationship[] = [];
  
  // Simple correlation detection for numeric fields
  const numericFields = fields.filter(f => f.dataType === 'numeric');
  
  for (let i = 0; i < numericFields.length; i++) {
    for (let j = i + 1; j < numericFields.length; j++) {
      const field1 = numericFields[i];
      const field2 = numericFields[j];
      
      const values1 = data.map(row => Number(row[field1.name])).filter(v => !isNaN(v));
      const values2 = data.map(row => Number(row[field2.name])).filter(v => !isNaN(v));
      
      if (values1.length === values2.length && values1.length > 10) {
        const correlation = calculateCorrelation(values1, values2);
        
        if (Math.abs(correlation) > 0.5) {
          relationships.push({
            sourceField: field1.name,
            targetField: field2.name,
            relationshipType: 'correlation',
            strength: Math.abs(correlation)
          });
        }
      }
    }
  }
  
  return relationships;
};

const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};
