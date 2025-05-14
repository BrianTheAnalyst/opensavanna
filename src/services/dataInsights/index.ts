
import { toast } from "sonner";
import { Dataset } from "@/types/dataset";
import { getDatasetVisualization } from "@/services";
import { transformSampleDataForCategory } from "@/services/visualization/dataTransformer";
import { getGeoJSONForDataset } from "@/services/visualization/datasetProcessor";
import { DataInsightResult } from "./types";
import { findRelevantDatasets } from "./datasetFinder";
import { determineVisualizationType, generateComparison } from "./visualizationUtils";
import { generateInsightsForQuery, generateAnswerFromData } from "./insightGenerator";
import { getSuggestedQuestions, DEFAULT_QUESTIONS } from "./suggestedQueries";

// Main function to process a user question and generate insights
export const processDataQuery = async (query: string): Promise<DataInsightResult> => {
  try {
    // 1. Analyze the question to determine relevant datasets
    const relevantDatasets = await findRelevantDatasets(query);
    if (!relevantDatasets.length) {
      throw new Error("No relevant datasets found for your question.");
    }

    // 2. Process each dataset to extract visualization data
    const visualizations = await Promise.all(
      relevantDatasets.map(async (dataset) => {
        try {
          const visualizationData = await getDatasetVisualization(dataset.id);
          const visType = determineVisualizationType(query, dataset.category);
          
          // Special handling for map visualizations
          let geoJSON = null;
          if (visType === 'map') {
            // Try to get GeoJSON data for the dataset
            geoJSON = await getGeoJSONForDataset(dataset.id);
            
            // If no GeoJSON but we need a map, add geo data to points if needed
            if (!geoJSON && visualizationData && visualizationData.length > 0) {
              visualizationData.forEach(item => {
                // Make sure points have coordinates for map rendering if they exist in the data
                if (item.latitude && !item.lat) item.lat = item.latitude;
                if (item.longitude && !item.lng) item.lng = item.longitude;
              });
            }
          }
          
          return {
            datasetId: dataset.id,
            title: dataset.title,
            type: visType,
            category: dataset.category,
            data: visualizationData && visualizationData.length > 0 
              ? visualizationData 
              : transformSampleDataForCategory(dataset.category, []),
            geoJSON: geoJSON
          };
        } catch (error) {
          console.error(`Error processing dataset ${dataset.title}:`, error);
          return {
            datasetId: dataset.id,
            title: dataset.title,
            type: 'bar' as const,
            category: dataset.category,
            data: transformSampleDataForCategory(dataset.category, [])
          };
        }
      })
    );

    // 3. Generate insights based on the data
    const allInsights = generateInsightsForQuery(query, relevantDatasets, visualizations);
    
    // 4. Generate a comparison if multiple datasets are available
    const comparisonResult = relevantDatasets.length > 1 
      ? generateComparison(relevantDatasets, visualizations)
      : undefined;

    // 5. Generate an answer to the question
    const answer = generateAnswerFromData(query, relevantDatasets, visualizations, allInsights);

    return {
      question: query,
      answer,
      datasets: relevantDatasets,
      visualizations,
      insights: allInsights,
      comparisonResult
    };
  } catch (error) {
    console.error("Error processing question:", error);
    toast.error("Failed to process your question");
    throw error;
  }
};

// Re-export other functions
export { getSuggestedQuestions, DEFAULT_QUESTIONS };
export type { DataInsightResult };
