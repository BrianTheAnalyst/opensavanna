
import { toast } from "sonner";

import { getDatasetVisualization } from "@/services";
import { transformSampleDataForCategory } from "@/services/visualization/dataTransformer";
import { getGeoJSONForDataset } from "@/services/visualization/datasetProcessor";
import { Dataset } from "@/types/dataset";

import { 
  addToConversationHistory, 
  getConversationContext
} from "./conversationContext";
import { 
  validateDataset, 
  generateActionableErrorMessage, 
  type ValidationResult 
} from "./dataValidation";
import { determineVisualizationType, generateComparison } from "./enhancedVisualizationUtils";
import { generateInsightsForQuery, generateAnswerFromData } from "./insightGenerator";
import { insightsCache, performCacheCleanup } from "./intelligentCache";
import { findRelevantDatasetsIntelligent } from "./intelligentDatasetFinder";
import { getSuggestedQuestions, DEFAULT_QUESTIONS } from "./suggestedQueries";
import { DataInsightResult } from "./types";

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
    
    // 1. Use intelligent dataset finder
    const relevantDatasets = await findRelevantDatasetsIntelligent(query, context);
    if (!relevantDatasets.length) {
      throw new Error("No relevant datasets found for your question.");
    }

    console.log('Found relevant datasets:', relevantDatasets.map(d => d.title));

    // 2. Process each dataset to extract visualization data with enhanced validation
    const visualizations = await Promise.all(
      relevantDatasets.map(async (dataset) => {
        try {
          const visualizationData = await getDatasetVisualization(dataset.id);
          
          // IMMEDIATE FIX: Validate data before processing
          const validation = validateDataset(visualizationData);
          
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

    // 3. Generate insights based on the data
    const allInsights = generateInsightsForQuery(query, relevantDatasets, visualizations);
    
    // 4. Generate enhanced comparison if multiple datasets are available
    const comparisonResult = relevantDatasets.length > 1 
      ? generateComparison(relevantDatasets, visualizations)
      : undefined;

    // 5. Generate an answer to the question
    const answer = generateAnswerFromData(query, relevantDatasets, visualizations, allInsights);

    // Store this interaction in conversation history
    const result: DataInsightResult = {
      question: query,
      answer,
      datasets: relevantDatasets,
      visualizations,
      insights: allInsights,
      comparisonResult
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

// Re-export other functions
export { 
  getSuggestedQuestions, 
  DEFAULT_QUESTIONS,
  getConversationContext
};
export type { DataInsightResult };
