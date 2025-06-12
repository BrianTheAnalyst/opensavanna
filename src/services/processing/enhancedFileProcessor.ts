
import { inferDatasetSchema, InferredSchema } from './schemaInferenceEngine';
import { analyzeSemantics, SemanticAnalysis } from './semanticAnalyzer';
import { generateDataSummary } from './statisticsUtils';

export interface EnhancedProcessingResult {
  data: any[];
  schema: InferredSchema;
  semantics: SemanticAnalysis;
  summary: any;
  recommendations: ProcessingRecommendation[];
}

export interface ProcessingRecommendation {
  type: 'visualization' | 'analysis' | 'data_quality' | 'enhancement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// Enhanced processing that combines schema inference with semantic analysis
export const processFileWithIntelligence = async (data: any[]): Promise<EnhancedProcessingResult> => {
  console.log('Starting enhanced file processing with', data.length, 'records');

  // Step 1: Infer schema structure
  const schema = inferDatasetSchema(data);
  console.log('Schema inference complete. Entity type:', schema.entityType);

  // Step 2: Perform semantic analysis
  const semantics = analyzeSemantics(schema, data);
  console.log('Semantic analysis complete. Domain:', semantics.domainClassification);

  // Step 3: Generate traditional summary
  const summary = generateDataSummary(data);

  // Step 4: Generate intelligent recommendations
  const recommendations = generateRecommendations(schema, semantics, data);

  return {
    data: data.slice(0, 1000), // Limit for performance
    schema,
    semantics,
    summary,
    recommendations
  };
};

const generateRecommendations = (
  schema: InferredSchema, 
  semantics: SemanticAnalysis, 
  data: any[]
): ProcessingRecommendation[] => {
  const recommendations: ProcessingRecommendation[] = [];

  // Visualization recommendations
  if (schema.temporalFields.length > 0 && schema.metricFields.length > 0) {
    recommendations.push({
      type: 'visualization',
      title: 'Time Series Visualization',
      description: `Create trend charts using ${schema.temporalFields[0]} and ${schema.metricFields[0]}`,
      priority: 'high',
      actionable: true
    });
  }

  if (schema.geographicFields.length > 0) {
    recommendations.push({
      type: 'visualization',
      title: 'Geographic Mapping',
      description: `Visualize data distribution across ${schema.geographicFields.join(', ')}`,
      priority: 'high',
      actionable: true
    });
  }

  if (schema.dimensionFields.length > 1 && schema.metricFields.length > 0) {
    recommendations.push({
      type: 'visualization',
      title: 'Multi-dimensional Analysis',
      description: 'Create cross-tabulation and comparison charts',
      priority: 'medium',
      actionable: true
    });
  }

  // Analysis recommendations from semantic analysis
  semantics.suggestedAnalyses.forEach(analysis => {
    recommendations.push({
      type: 'analysis',
      title: analysis,
      description: `Recommended based on ${semantics.domainClassification} domain classification`,
      priority: 'medium',
      actionable: true
    });
  });

  // Data quality recommendations
  if (semantics.dataQualityScore < 80) {
    recommendations.push({
      type: 'data_quality',
      title: 'Data Quality Improvement',
      description: `Current quality score: ${semantics.dataQualityScore.toFixed(1)}%. Consider cleaning missing values and outliers.`,
      priority: 'high',
      actionable: true
    });
  }

  if (semantics.completenessScore < 90) {
    recommendations.push({
      type: 'data_quality',
      title: 'Address Missing Data',
      description: `${(100 - semantics.completenessScore).toFixed(1)}% of data is missing. Consider imputation strategies.`,
      priority: 'medium',
      actionable: true
    });
  }

  // Enhancement recommendations
  if (semantics.knowledgeLinks.length > 0) {
    recommendations.push({
      type: 'enhancement',
      title: 'External Data Enrichment',
      description: `Found ${semantics.knowledgeLinks.length} potential data sources for enrichment`,
      priority: 'low',
      actionable: true
    });
  }

  if (schema.relationships.length > 0) {
    recommendations.push({
      type: 'analysis',
      title: 'Relationship Analysis',
      description: `Detected ${schema.relationships.length} significant relationships between fields`,
      priority: 'medium',
      actionable: true
    });
  }

  return recommendations.slice(0, 10); // Limit to top 10 recommendations
};

// Integration with existing file processors
export const enhanceExistingProcessors = () => {
  // This function can be used to gradually integrate the enhanced processing
  // with existing CSV, JSON, and GeoJSON processors
  console.log('Enhanced processing capabilities available');
};
