
import { generateInsights } from '@/utils/datasetVisualizationUtils';

/**
 * Generate insights for visualization data
 */
export function generateInsightsForData(data: any[], category: string, title: string): string[] {
  try {
    return generateInsights(data, category, title);
  } catch (err) {
    console.error("Error generating insights:", err);
    return ["Unable to generate insights for this dataset."];
  }
}
