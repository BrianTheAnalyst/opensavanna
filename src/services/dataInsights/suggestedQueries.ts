
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
    datasets.forEach(dataset => {
      categoriesMap[dataset.category.toLowerCase()] = (categoriesMap[dataset.category.toLowerCase()] || 0) + 1;
    });
    
    // Generate questions based on available categories
    const questions: string[] = [];
    
    // Add category-specific questions
    Object.entries(categoriesMap).forEach(([category, count]) => {
      if (category === 'economics' || category === 'economy') {
        questions.push("What are the economic growth trends in Kenya?");
        questions.push("How do economic indicators compare across different regions?");
      } else if (category === 'health' || category === 'healthcare') {
        questions.push("What is the state of healthcare access across different countries?");
        questions.push("How have health outcomes improved over the past decade?");
      } else if (category === 'education') {
        questions.push("What are the education enrollment rates by region?");
        questions.push("How does education spending correlate with literacy rates?");
      } else if (category === 'transport' || category === 'transportation') {
        questions.push("What are the most used transport modes in urban areas?");
        questions.push("How has transportation infrastructure developed over time?");
      } else if (category === 'environment') {
        questions.push("What environmental factors show the most concerning trends?");
        questions.push("How do different regions compare in environmental sustainability?");
      }
    });
    
    // If we have multiple categories, add comparison questions
    const categories = Object.keys(categoriesMap);
    if (categories.length >= 2) {
      questions.push(`How does ${categories[0]} relate to ${categories[1]}?`);
    }
    
    // Add some general questions
    questions.push("What are the key insights from the most recent datasets?");
    questions.push("Show me visualizations of the most important trends");
    
    // Return a random selection of 5 questions or fewer
    return questions.length <= 5 
      ? questions 
      : questions.sort(() => 0.5 - Math.random()).slice(0, 5);
  } catch (error) {
    console.error("Error generating suggested questions:", error);
    return DEFAULT_QUESTIONS;
  }
};
