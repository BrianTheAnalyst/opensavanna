
import { toast } from "sonner";
import { Dataset } from "@/types/dataset";
import { getDatasetVisualization } from "@/services";
import { transformSampleDataForCategory } from "@/services/visualization/dataTransformer";
import { getGeoJSONForDataset } from "@/services/visualization/datasetProcessor";
import { DataInsightResult } from "./types";
import { findRelevantDatasetsIntelligent } from "./intelligentDatasetFinder";
import { determineVisualizationType, generateComparison } from "./enhancedVisualizationUtils";
import { generateInsightsForQuery, generateAnswerFromData } from "./insightGenerator";
import { getSuggestedQuestions, DEFAULT_QUESTIONS } from "./suggestedQueries";
import { 
  addToConversationHistory, 
  getConversationContext
} from "./conversationContext";
import { insightsCache, performCacheCleanup } from "./intelligentCache";

// Main function to process a user question and generate insights with enhanced intelligence
export const processDataQuery = async (query: string): Promise<DataInsightResult> => {
  try {
    // Check cache first for complete results
    const cached = insightsCache.get(query);
    if (cached) {
      console.log('Returning cached insights for query:', query);
      return cached;
    }

    // Get conversation context to enhance the search
    const context = getConversationContext();
    
    // 1. Use intelligent dataset finder
    const relevantDatasets = await findRelevantDatasetsIntelligent(query, context);
    if (!relevantDatasets.length) {
      throw new Error("No relevant datasets found for your question.");
    }

    console.log('Found relevant datasets:', relevantDatasets.map(d => d.title));

    // 2. Process each dataset to extract visualization data with enhanced chart selection
    const visualizations = await Promise.all(
      relevantDatasets.map(async (dataset) => {
        try {
          const visualizationData = await getDatasetVisualization(dataset.id);
          
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

          // Add enhanced properties for better visualization control
          const result = {
            datasetId: dataset.id,
            title: dataset.title,
            type: visType,
            category: dataset.category,
            data: visualizationData && visualizationData.length > 0 
              ? visualizationData 
              : transformSampleDataForCategory(dataset.category, []),
            geoJSON: geoJSON,
            timeAxis: visType === 'line' ? 'Time Period' : undefined,
            valueLabel: `${dataset.category} Value`
          };

          console.log(`Processed dataset ${dataset.title} with visualization type: ${visType}`);
          return result;
        } catch (error) {
          console.error(`Error processing dataset ${dataset.title}:`, error);
          return {
            datasetId: dataset.id,
            title: dataset.title,
            type: 'bar' as const,
            category: dataset.category,
            data: transformSampleDataForCategory(dataset.category, []),
            timeAxis: undefined,
            valueLabel: `${dataset.category} Value`
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
    const result = {
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
