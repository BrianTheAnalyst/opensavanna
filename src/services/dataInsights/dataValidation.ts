/**
 * Data Validation Layer - Immediate Fix #1
 * Validates dataset structure and data quality before processing
 */

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100
  dataSource: 'real' | 'sample' | 'empty';
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

  // Check if this is sample data
  const isSampleData = detectSampleData(data);
  const dataSource: 'real' | 'sample' | 'empty' = isSampleData ? 'sample' : 'real';

  // Calculate data quality metrics
  const metrics = calculateDataMetrics(data);
  const quality = calculateDataQuality(data, metrics);
  
  // Validate data structure
  const structureValidation = validateDataStructure(data);
  issues.push(...structureValidation.issues);
  
  // Calculate confidence score
  let confidence = 100;
  
  if (isSampleData) {
    confidence = 25; // Low confidence for sample data
    issues.push('Using sample/demo data');
    recommendations.push('Upload real dataset for accurate insights');
  }
  
  // Reduce confidence based on data quality
  confidence = Math.max(confidence * (quality.completeness / 100), 10);
  
  if (quality.completeness < 80) {
    issues.push(`Dataset is ${(100 - quality.completeness).toFixed(0)}% incomplete`);
    recommendations.push('Check for missing values in key fields');
  }
  
  if (quality.consistency < 70) {
    issues.push('Data format inconsistencies detected');
    recommendations.push('Standardize data formats across all records');
  }

  return {
    isValid: confidence > 30,
    confidence: Math.round(confidence),
    dataSource,
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
    'East Africa', 'West Africa', 'North Africa', 'Southern Africa', 'Central Africa',
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
    return `No data available for "${query}". Try uploading a dataset or searching for "economic trends" or "health statistics".`;
  }

  if (validation.dataSource === 'sample') {
    return `Showing sample data for "${query}". Upload your own dataset to see real insights and analysis.`;
  }

  if (validation.confidence < 50) {
    const mainIssue = validation.issues[0] || 'data quality issues';
    const suggestion = validation.recommendations[0] || 'try refining your search';
    return `Low confidence results for "${query}" due to ${mainIssue}. ${suggestion}.`;
  }

  return `Found ${validation.confidence}% confidence match for "${query}".`;
};