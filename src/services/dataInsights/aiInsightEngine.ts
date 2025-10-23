/**
 * AI-Powered Insight Engine
 * Integrates with external AI services for natural language understanding
 */

import { Dataset } from "@/types/dataset";
import { processSemanticQuery, calculateSemanticSimilarity } from './semanticQueryProcessor';
import { calculateDataDrivenInsights } from './calculateInsights';
import { validateDataset } from './dataValidation';

export interface AIInsightResult {
  query: string;
  interpretation: {
    intent: string;
    domain: string;
    confidence: number;
    keywords: string[];
    synonyms: string[];
  };
  datasets: {
    dataset: Dataset;
    relevanceScore: number;
    semanticScore: number;
    dataQuality: number;
  }[];
  insights: {
    type: 'statistical' | 'trend' | 'outlier' | 'distribution' | 'ai-generated';
    description: string;
    confidence: number;
    dataSource: 'real' | 'sample' | 'empty';
    supporting_data?: any;
  }[];
  recommendations: string[];
  confidence: number;
}

/**
 * Process query using AI-enhanced semantic understanding
 */
export const processQueryWithAI = async (
  query: string,
  availableDatasets: Dataset[],
  visualizationData: Record<string, any[]>
): Promise<AIInsightResult> => {
  
  // Step 1: Semantic query processing
  const queryIntent = processSemanticQuery(query);
  
  // Step 2: Enhanced dataset matching using semantic similarity
  const rankedDatasets = availableDatasets
    .map(dataset => {
      const semanticScore = calculateSemanticSimilarity(queryIntent, dataset);
      const data = visualizationData[dataset.id] || [];
      const validation = validateDataset(data);
      
      return {
        dataset,
        relevanceScore: semanticScore,
        semanticScore,
        dataQuality: validation.confidence
      };
    })
    .filter(item => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5); // Top 5 most relevant datasets
  
  // Step 3: Generate AI-enhanced insights
  const insights: AIInsightResult['insights'] = [];
  
  for (const { dataset, dataQuality } of rankedDatasets.slice(0, 3)) {
    const data = visualizationData[dataset.id] || [];
    const validation = validateDataset(data);
    
    if (data.length > 0 && validation.isValid) {
      // Use statistical analysis for real insights
      const statisticalInsights = calculateDataDrivenInsights(data, dataset.category, dataset.title);
      
      statisticalInsights.forEach(insight => {
        insights.push({
          type: insight.type,
          description: insight.description,
          confidence: insight.confidence,
          dataSource: validation.dataSource,
          supporting_data: insight.data
        });
      });
    } else {
      // Provide transparent messaging for invalid data
      insights.push({
        type: 'ai-generated',
        description: validation.dataSource === 'empty' 
          ? `No data available for "${dataset.title}". Consider uploading a relevant dataset.`
          : `Dataset "${dataset.title}" has data quality issues (${validation.confidence}% confidence).`,
        confidence: validation.confidence,
        dataSource: validation.dataSource
      });
    }
  }
  
  // Step 4: Generate recommendations
  const recommendations = generateActionableRecommendations(queryIntent, rankedDatasets, insights);
  
  // Step 5: Calculate overall confidence
  const overallConfidence = calculateOverallConfidence(queryIntent, rankedDatasets, insights);
  
  return {
    query,
    interpretation: {
      intent: queryIntent.type,
      domain: queryIntent.domain,
      confidence: queryIntent.confidence,
      keywords: queryIntent.keywords,
      synonyms: queryIntent.synonyms.slice(0, 10) // Limit for readability
    },
    datasets: rankedDatasets,
    insights: insights.slice(0, 8), // Limit to most relevant insights
    recommendations,
    confidence: overallConfidence
  };
};

/**
 * Generate actionable recommendations based on analysis
 */
const generateActionableRecommendations = (
  queryIntent: any,
  rankedDatasets: any[],
  insights: any[]
): string[] => {
  const recommendations: string[] = [];
  
  // Data availability recommendations
  if (rankedDatasets.length === 0) {
    recommendations.push(`No datasets found for "${queryIntent.domain}". Try uploading relevant data or search for "health statistics" or "economic indicators".`);
  } else if (rankedDatasets.length < 3) {
    recommendations.push(`Limited datasets available. Consider uploading more ${queryIntent.domain} data for comprehensive analysis.`);
  }
  
  // Data quality recommendations
  const lowQualityDatasets = rankedDatasets.filter(d => d.dataQuality < 70);
  if (lowQualityDatasets.length > 0) {
    recommendations.push(`${lowQualityDatasets.length} dataset(s) have data quality issues. Review data completeness and format consistency.`);
  }
  
  // Analysis depth recommendations
  const highConfidenceInsights = insights.filter(i => i.confidence > 80);
  if (highConfidenceInsights.length < 3) {
    recommendations.push('For deeper insights, try more specific queries or upload datasets with richer data.');
  }
  
  // Intent-specific recommendations
  switch (queryIntent.type) {
    case 'trend':
      recommendations.push('For trend analysis, ensure your datasets include time-series data with consistent time intervals.');
      break;
    case 'compare':
      recommendations.push('For effective comparisons, upload datasets with similar metrics across different counties or time periods.');
      break;
    case 'correlate':
      recommendations.push('For correlation analysis, include multiple related variables in your datasets.');
      break;
  }
  
  // Geographic recommendations
  if (queryIntent.geographic && rankedDatasets.length > 0) {
    recommendations.push(`Found data related to ${queryIntent.geographic}. Consider exploring regional comparisons or temporal trends.`);
  }
  
  return recommendations.slice(0, 4); // Limit to most actionable recommendations
};

/**
 * Calculate overall confidence score for the analysis
 */
const calculateOverallConfidence = (
  queryIntent: any,
  rankedDatasets: any[],
  insights: any[]
): number => {
  let confidence = 0;
  
  // Base confidence from query interpretation
  confidence += queryIntent.confidence * 30;
  
  // Dataset relevance and quality
  if (rankedDatasets.length > 0) {
    const avgDatasetScore = rankedDatasets.reduce((sum, d) => sum + d.dataQuality, 0) / rankedDatasets.length;
    confidence += avgDatasetScore * 0.4;
  }
  
  // Insight quality
  if (insights.length > 0) {
    const avgInsightConfidence = insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length;
    confidence += avgInsightConfidence * 0.3;
  }
  
  // Penalty for sample data
  const sampleDataPenalty = insights.filter(i => i.dataSource === 'sample').length * 10;
  confidence = Math.max(confidence - sampleDataPenalty, 10);
  
  return Math.min(Math.round(confidence), 100);
};

/**
 * Future: Integration point for external AI services
 * This function can be extended to integrate with OpenAI, Anthropic, or other AI services
 */
export const enhanceInsightsWithExternalAI = async (
  insights: AIInsightResult['insights'],
  query: string,
  apiKey?: string
): Promise<AIInsightResult['insights']> => {
  // Placeholder for future AI integration
  // TODO: Integrate with OpenAI GPT-4 or similar for natural language insight generation
  
  if (!apiKey) {
    console.log('No AI API key provided, using statistical insights only');
    return insights;
  }
  
  // Future implementation:
  // 1. Send statistical insights to AI service
  // 2. Request natural language interpretation
  // 3. Validate AI-generated insights against data
  // 4. Return enhanced insights with AI-generated descriptions
  
  return insights;
};