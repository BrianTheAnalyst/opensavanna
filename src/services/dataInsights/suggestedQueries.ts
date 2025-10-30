
import { getDatasets } from "@/services";

// Default suggested questions if we can't generate dynamic ones
export const DEFAULT_QUESTIONS = [
  "What are the economic growth trends in Kenya?",
  "How does healthcare access vary across different countries?",
  "What is the relationship between education and economic development?",
  "Show me visualizations of environmental data",
  "Compare transportation infrastructure across different regions"
];

// Get suggested questions based on available datasets
export const getSuggestedQuestions = async (): Promise<string[]> => {
  try {
    const datasets = await getDatasets();
    
    if (!datasets || datasets.length === 0) {
      return DEFAULT_QUESTIONS;
    }
    
    // Group datasets by category
    const categoriesMap: Record<string, number> = {};
    const datasetsByCategory: Record<string, typeof datasets> = {};
    
    datasets.forEach(dataset => {
      const category = dataset.category.toLowerCase();
      categoriesMap[category] = (categoriesMap[category] || 0) + 1;
      if (!datasetsByCategory[category]) {
        datasetsByCategory[category] = [];
      }
      datasetsByCategory[category].push(dataset);
    });
    
    // Generate questions based on available categories
    const questions: string[] = [];
    
    // Sort categories by dataset count
    const sortedCategories = Object.entries(categoriesMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // Focus on top 4 categories
    
    // Add category-specific questions with context from actual datasets
    sortedCategories.forEach(([category, count]) => {
      const categoryDatasets = datasetsByCategory[category];
      const recentDataset = categoryDatasets[0]; // Get most recent
      
      if (category === 'economics' || category === 'economy') {
        questions.push("What are the economic growth trends in Kenya?");
        if (count > 1) questions.push("Compare economic indicators across different regions");
      } else if (category === 'health' || category === 'healthcare') {
        questions.push("What is the state of healthcare access?");
        if (count > 1) questions.push("How have health outcomes changed over time?");
      } else if (category === 'education') {
        questions.push("Analyze education enrollment trends by region");
        if (count > 1) questions.push("How does education spending correlate with outcomes?");
      } else if (category === 'transport' || category === 'transportation') {
        questions.push("What are the transportation trends in urban areas?");
        if (count > 1) questions.push("Compare transport infrastructure development");
      } else if (category === 'environment') {
        questions.push("Show environmental sustainability indicators");
        if (count > 1) questions.push("How do regions compare in environmental metrics?");
      } else if (category === 'agriculture') {
        questions.push("Analyze agricultural production trends");
        if (count > 1) questions.push("Compare farming practices across regions");
      } else if (category === 'demographics') {
        questions.push("What are the population trends?");
        if (count > 1) questions.push("Show demographic changes over time");
      } else {
        // Generic question for other categories
        questions.push(`Show trends in ${category}`);
      }
    });
    
    // Add cross-category comparison if multiple categories exist
    const categories = Object.keys(categoriesMap);
    if (categories.length >= 2) {
      questions.push(`How does ${categories[0]} relate to ${categories[1]}?`);
    }
    
    // Add general exploration questions
    questions.push("What are the key insights from recent datasets?");
    if (datasets.length > 5) {
      questions.push("Show me the most important trends across all data");
    }
    
    // Return a selection of up to 5 unique questions
    const uniqueQuestions = [...new Set(questions)];
    return uniqueQuestions.length <= 5 
      ? uniqueQuestions 
      : uniqueQuestions.slice(0, 5);
  } catch (error) {
    console.error("Error generating suggested questions:", error);
    return DEFAULT_QUESTIONS;
  }
};
