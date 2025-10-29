/**
 * Data Validation Layer - Immediate Fix #1
 * Validates dataset structure and data quality before processing
 */

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100
  dataSource: 'real' | 'empty';
  issues: string[];
  recommendations: string[];
  dataQuality: {
    completeness: number;
    consistency: number;
    accuracy: number;
  };
}

export interface DatasetMetrics {
  totalRecords: number;
  fieldsWithData: number;
  totalFields: number;
  nullPercentage: number;
  uniqueValues: number;
}

/**
 * Validate dataset structure and quality
 */
export const validateDataset = (
  data: any[], 
  expectedSchema?: Record<string, string>
): ValidationResult => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Basic structure validation
  if (!Array.isArray(data)) {
    return {
      isValid: false,
      confidence: 0,
      dataSource: 'empty',
      issues: ['Data is not in array format'],
      recommendations: ['Ensure dataset is properly formatted as JSON array'],
      dataQuality: { completeness: 0, consistency: 0, accuracy: 0 }
    };
  }

  if (data.length === 0) {
    return {
      isValid: false,
      confidence: 0,
      dataSource: 'empty',
      issues: ['Dataset contains no records'],
      recommendations: ['Upload a dataset with actual data'],
      dataQuality: { completeness: 0, consistency: 0, accuracy: 0 }
    };
  }

  // STRICT: Check if this is sample data and REJECT it
  const isSampleData = detectSampleData(data);
  if (isSampleData) {
    return {
      isValid: false,
      confidence: 0,
      dataSource: 'empty' as const,
      issues: ['Sample/demo data detected - not acceptable for visualization'],
      recommendations: ['Upload a real dataset with actual data for analysis'],
      dataQuality: { completeness: 0, consistency: 0, accuracy: 0 }
    };
  }

  // Calculate data quality metrics
  const metrics = calculateDataMetrics(data);
  const quality = calculateDataQuality(data, metrics);
  
  // Validate data structure
  const structureValidation = validateDataStructure(data);
  issues.push(...structureValidation.issues);
  
  // Calculate confidence score based on quality
  let confidence = 
    quality.completeness * 0.4 +
    quality.consistency * 0.3 +
    quality.accuracy * 0.3;
  
  // STRICT: Require minimum 60% confidence
  if (confidence < 60) {
    issues.push(`Data quality too low (${Math.round(confidence)}% confidence, minimum 60% required)`);
    recommendations.push('Improve data quality by ensuring complete, consistent records');
  }
  
  if (quality.completeness < 80) {
    issues.push(`Dataset is ${(100 - quality.completeness).toFixed(0)}% incomplete`);
    recommendations.push('Check for missing values in key fields');
  }
  
  if (quality.consistency < 70) {
    issues.push('Data format inconsistencies detected');
    recommendations.push('Standardize data formats across all records');
  }

  // STRICT: Only accept data with 60%+ confidence
  const isValid = confidence >= 60 && structureValidation.issues.length === 0;

  return {
    isValid,
    confidence: Math.round(confidence),
    dataSource: 'real',
    issues,
    recommendations,
    dataQuality: quality
  };
};

/**
 * Detect if data appears to be sample/demo data
 */
const detectSampleData = (data: any[]): boolean => {
  const sampleIndicators = [
    'Category A', 'Category B', 'Category C', 'Category D', 'Category E',
    'Coastal Region', 'Central Region', 'Eastern Region', 'North Eastern Region', 'Nyanza Region', 'Rift Valley Region', 'Western Region',
    'Healthcare Access', 'Infant Mortality', 'Life Expectancy',
    'Primary Enrollment', 'Secondary Enrollment', 'Tertiary Enrollment',
    'Groceries', 'Utilities', 'Entertainment'
  ];

  const dataString = JSON.stringify(data).toLowerCase();
  const sampleMatches = sampleIndicators.filter(indicator => 
    dataString.includes(indicator.toLowerCase())
  );

  // If more than 30% of sample indicators are found, likely sample data
  return sampleMatches.length > (sampleIndicators.length * 0.3);
};

/**
 * Calculate data quality metrics
 */
const calculateDataMetrics = (data: any[]): DatasetMetrics => {
  if (data.length === 0) {
    return { totalRecords: 0, fieldsWithData: 0, totalFields: 0, nullPercentage: 100, uniqueValues: 0 };
  }

  const firstItem = data[0];
  const fields = Object.keys(firstItem);
  
  let fieldsWithData = 0;
  let totalNulls = 0;
  let totalValues = 0;
  const uniqueValues = new Set();

  fields.forEach(field => {
    let hasValidData = false;
    data.forEach(item => {
      const value = item[field];
      totalValues++;
      
      if (value === null || value === undefined || value === '') {
        totalNulls++;
      } else {
        hasValidData = true;
        uniqueValues.add(String(value));
      }
    });
    
    if (hasValidData) fieldsWithData++;
  });

  return {
    totalRecords: data.length,
    fieldsWithData,
    totalFields: fields.length,
    nullPercentage: (totalNulls / totalValues) * 100,
    uniqueValues: uniqueValues.size
  };
};

/**
 * Calculate overall data quality scores
 */
const calculateDataQuality = (data: any[], metrics: DatasetMetrics) => {
  // Completeness: percentage of non-null values
  const completeness = 100 - metrics.nullPercentage;
  
  // Consistency: check if similar fields have consistent data types
  let consistency = 100;
  const firstItem = data[0];
  const expectedTypes: Record<string, string> = {};
  
  Object.keys(firstItem).forEach(field => {
    expectedTypes[field] = typeof firstItem[field];
  });

  let inconsistentFields = 0;
  data.forEach(item => {
    Object.keys(expectedTypes).forEach(field => {
      if (typeof item[field] !== expectedTypes[field] && item[field] !== null) {
        inconsistentFields++;
      }
    });
  });

  if (inconsistentFields > 0) {
    consistency = Math.max(100 - (inconsistentFields / (data.length * metrics.totalFields)) * 100, 0);
  }

  // Accuracy: based on uniqueness and reasonable value ranges
  const uniquenessRatio = metrics.uniqueValues / (data.length * metrics.totalFields);
  const accuracy = Math.min(uniquenessRatio * 100, 100);

  return {
    completeness: Math.round(completeness),
    consistency: Math.round(consistency),
    accuracy: Math.round(accuracy)
  };
};

/**
 * Validate data structure requirements
 */
const validateDataStructure = (data: any[]) => {
  const issues: string[] = [];
  
  if (data.length === 0) {
    issues.push('Empty dataset');
    return { issues };
  }

  const firstItem = data[0];
  const requiredFields = ['name', 'value']; // Basic visualization requirements
  
  requiredFields.forEach(field => {
    if (!(field in firstItem)) {
      issues.push(`Missing required field: ${field}`);
    }
  });

  // Check for numeric values
  const hasNumericValues = data.some(item => 
    Object.values(item).some(value => typeof value === 'number' && !isNaN(value))
  );
  
  if (!hasNumericValues) {
    issues.push('No numeric values found for visualization');
  }

  return { issues };
};

/**
 * Generate actionable error messages based on validation
 */
export const generateActionableErrorMessage = (validation: ValidationResult, query: string): string => {
  if (validation.dataSource === 'empty') {
    return `No data available for "${query}". Try uploading a dataset or searching for different terms.`;
  }

  if (validation.confidence < 50) {
    const mainIssue = validation.issues[0] || 'data quality issues';
    const suggestion = validation.recommendations[0] || 'try refining your search';
    return `Low confidence results for "${query}" due to ${mainIssue}. ${suggestion}.`;
  }

  return `Found ${validation.confidence}% confidence match for "${query}".`;
};