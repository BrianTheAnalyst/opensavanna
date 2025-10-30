
import { toast } from "sonner";
import { Dataset } from "@/types/dataset";
import { getDatasetVisualization } from "@/services";
import { transformSampleDataForCategory } from "@/services/visualization/dataTransformer";
import { getGeoJSONForDataset } from "@/services/visualization/datasetProcessor";
import { DataInsightResult } from "./types";
import { findRelevantDatasetsIntelligent } from "./intelligentDatasetFinder";
import { determineVisualizationType, generateComparison } from "./enhancedVisualizationUtils";
import { generateInsightsForQuery, generateAnswerFromData } from "./insightGenerator";
import { processQueryWithAI } from "./aiInsightEngine";
import { getSuggestedQuestions, DEFAULT_QUESTIONS } from "./suggestedQueries";
import { 
  addToConversationHistory, 
  getConversationContext
} from "./conversationContext";
import { insightsCache, performCacheCleanup } from "./intelligentCache";
import { 
  validateDataset, 
  generateActionableErrorMessage, 
  type ValidationResult 
} from "./dataValidation";

// Main function to process a user question and generate insights with enhanced intelligence
export const processDataQuery = async (query: string): Promise<DataInsightResult> => {
  try {
    // Check cache first for complete results
    const cached = insightsCache.get(query);
    if (cached && typeof cached === 'object' && 'question' in cached) {
      console.log('Returning cached insights for query:', query);
      return cached as DataInsightResult;
    }

    // Get conversation context to enhance the search
    const context = getConversationContext();
    
    // 1. Use intelligent dataset finder with strict relevance filtering
    const relevantDatasets = await findRelevantDatasetsIntelligent(query, context);
    if (!relevantDatasets.length) {
      throw new Error("No relevant datasets found for your question. Please try refining your query or upload relevant datasets.");
    }

    console.log('Found relevant datasets:', relevantDatasets.map(d => d.title));

    // 2. Process each dataset to extract visualization data with enhanced validation
    const visualizations = await Promise.all(
      relevantDatasets.map(async (dataset) => {
        try {
          const visualizationData = await getDatasetVisualization(dataset.id);
          
          // STRICT: Validate data before processing - reject low quality data
          const validation = validateDataset(visualizationData);
          
          // Reject invalid or low-confidence data
          if (!validation.isValid || validation.confidence < 60) {
            console.warn(`Dataset ${dataset.title} rejected: confidence ${validation.confidence}%, issues:`, validation.issues);
            throw new Error(`Data quality insufficient: ${validation.issues.join(', ')}`);
          }
          
          // Use enhanced visualization type determination
          const visType = determineVisualizationType(query, dataset.category, visualizationData);
          
          // Special handling for map visualizations
          let geoJSON = null;
          if (visType === 'map') {
            geoJSON = await getGeoJSONForDataset(dataset.id);
            
            if (!geoJSON && visualizationData && visualizationData.length > 0) {
              visualizationData.forEach(item => {
                if (item.latitude && !item.lat) item.lat = item.latitude;
                if (item.longitude && !item.lng) item.lng = item.longitude;
              });
            }
          }

          // Add enhanced properties with validation results
          const result = {
            datasetId: dataset.id,
            title: dataset.title,
            type: visType,
            category: dataset.category,
            data: visualizationData && visualizationData.length > 0 
              ? visualizationData 
              : null,
            geoJSON: geoJSON,
            timeAxis: visType === 'line' ? 'Time Period' : undefined,
            valueLabel: `${dataset.category} Value`,
            hasData: validation.isValid && visualizationData && visualizationData.length > 0,
            // NEW: Add validation metadata
            validation: validation,
            confidence: validation.confidence,
            dataSource: validation.dataSource,
            error: !validation.isValid ? generateActionableErrorMessage(validation, query) : undefined
          };

          console.log(`Processed dataset ${dataset.title} with validation confidence: ${validation.confidence}%`);
          return result;
        } catch (error) {
          console.error(`Error processing dataset ${dataset.title}:`, error);
          return {
            datasetId: dataset.id,
            title: dataset.title,
            type: 'bar' as const,
            category: dataset.category,
            data: null,
            timeAxis: undefined,
            valueLabel: `${dataset.category} Value`,
            hasData: false,
            validation: { 
              isValid: false, 
              confidence: 0, 
              dataSource: 'empty' as const,
              issues: ['Failed to load dataset'],
              recommendations: ['Try refreshing or contact support'],
              dataQuality: { completeness: 0, consistency: 0, accuracy: 0 }
            },
            confidence: 0,
            dataSource: 'empty' as const,
            error: `Failed to load dataset: ${error.message}`
          };
        }
      })
    );

    // 3. Enhanced AI-powered insight generation
    const visualizationDataMap = visualizations.reduce((acc, viz) => {
      acc[viz.datasetId] = viz.data || [];
      return acc;
    }, {} as Record<string, any[]>);
    
    const aiResult = await processQueryWithAI(query, relevantDatasets, visualizationDataMap);
    
    // 4. Generate traditional insights as fallback/supplement
    const traditionalInsights = generateInsightsForQuery(query, relevantDatasets, visualizations);
    
    // 5. Combine AI insights with traditional ones
    const allInsights = [
      ...aiResult.insights.map(insight => insight.description),
      ...traditionalInsights.slice(0, 2) // Add a few traditional insights as backup
    ].slice(0, 8); // Limit total insights
    
    // 6. Generate enhanced comparison if multiple datasets are available
    const comparisonResult = relevantDatasets.length > 1 
      ? generateComparison(relevantDatasets, visualizations)
      : undefined;

    // 7. Generate an enhanced answer using AI analysis
    const answer = generateEnhancedAnswer(query, aiResult, allInsights);

    // Store enhanced result with AI analysis
    const result: DataInsightResult = {
      question: query,
      answer,
      datasets: relevantDatasets,
      visualizations: visualizations.map(viz => ({
        ...viz,
        // Add AI confidence and data source information
        confidence: aiResult.datasets.find(d => d.dataset.id === viz.datasetId)?.dataQuality || viz.confidence || 0,
        aiRelevanceScore: aiResult.datasets.find(d => d.dataset.id === viz.datasetId)?.relevanceScore || 0
      })),
      insights: allInsights,
      comparisonResult,
      // Add AI analysis metadata
      aiAnalysis: {
        confidence: aiResult.confidence,
        interpretation: aiResult.interpretation,
        recommendations: aiResult.recommendations
      }
    };
    
    // Cache the complete result
    insightsCache.set(query, result);
    
    addToConversationHistory(query, result);
    
    console.log('Successfully processed query with enhanced intelligence');
    return result;
  } catch (error) {
    console.error("Error processing question:", error);
    toast.error("Failed to process your question");
    throw error;
  }
};

// Periodic cleanup to maintain cache performance
setInterval(() => {
  performCacheCleanup();
}, 5 * 60 * 1000); // Every 5 minutes

/**
 * Generate enhanced answer using AI analysis
 */
const generateEnhancedAnswer = (query: string, aiResult: any, insights: string[]): string => {
  const { interpretation, confidence, datasets } = aiResult;
  
  // Start with query interpretation
  let answer = `Based on analysis of ${datasets.length} ${datasets.length === 1 ? 'dataset' : 'datasets'} `;
  
  // Add confidence indicator
  if (confidence >= 80) {
    answer += `with high confidence (${confidence}%), `;
  } else if (confidence >= 60) {
    answer += `with moderate confidence (${confidence}%), `;
  } else {
    answer += `with limited confidence (${confidence}%) due to data quality issues, `;
  }
  
  // Add domain context
  if (interpretation.domain !== 'general') {
    answer += `focusing on ${interpretation.domain} data, `;
  }
  
  // Add key finding
  if (insights.length > 0) {
    const keyInsight = insights[0].toLowerCase().replace(/^[a-z]/, letter => letter.toUpperCase());
    answer += `the analysis reveals that ${keyInsight.replace(/[.!?]$/, '')}. `;
  }
  
  // STRICT: All data must be real - no sample data allowed
  const realDatasets = datasets.filter((d: any) => d.dataQuality > 60).length;
  if (realDatasets < datasets.length) {
    answer += `Note: Some datasets had insufficient quality and were excluded from analysis. `;
  }
  
  // Add actionable closing
  answer += `Explore the visualizations below for detailed patterns and consider the recommendations provided for deeper analysis.`;
  
  return answer;
};

// Re-export other functions
export { 
  getSuggestedQuestions, 
  DEFAULT_QUESTIONS,
  getConversationContext,
  processQueryWithAI
};
export type { DataInsightResult };
export * from './datasetGuidance';
