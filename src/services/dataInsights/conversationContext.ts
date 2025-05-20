
import { DataInsightResult } from "./types";

// Define the conversation context interface
export interface ConversationContext {
  history: {
    question: string;
    timestamp: number;
    datasetIds: string[];
    categories: string[];
  }[];
  currentDatasets: string[];
}

// Initialize an empty conversation context
const initialContext: ConversationContext = {
  history: [],
  currentDatasets: [],
};

// Use singleton pattern to maintain context across the application
let conversationContext: ConversationContext = { ...initialContext };

// Add a question to the conversation history
export const addToConversationHistory = (
  question: string, 
  result: DataInsightResult
) => {
  const datasetIds = result.datasets.map(dataset => dataset.id);
  const categories = [...new Set(result.datasets.map(dataset => dataset.category))];
  
  conversationContext.history.push({
    question,
    timestamp: Date.now(),
    datasetIds,
    categories,
  });
  
  // Limit history to last 5 questions
  if (conversationContext.history.length > 5) {
    conversationContext.history = conversationContext.history.slice(-5);
  }
  
  // Update current datasets
  conversationContext.currentDatasets = datasetIds;
};

// Get the current conversation context
export const getConversationContext = (): ConversationContext => {
  return { ...conversationContext };
};

// Reset the conversation context
export const resetConversationContext = () => {
  conversationContext = { ...initialContext };
};

// Get related questions based on conversation history
export const getRelatedQuestions = async (
  currentQuestion: string
): Promise<string[]> => {
  // If no history, return empty array
  if (conversationContext.history.length === 0) {
    return [];
  }
  
  const recentCategories = conversationContext.history
    .flatMap(item => item.categories)
    .filter((value, index, self) => self.indexOf(value) === index)
    .slice(0, 3);
  
  // Generate follow-up questions based on context
  const followUpQuestions: string[] = [];
  
  // Add comparison with previous results if we have history
  if (conversationContext.history.length > 0) {
    const lastQuestion = conversationContext.history[conversationContext.history.length - 1];
    
    if (lastQuestion.categories.includes('economics')) {
      followUpQuestions.push("How does this compare to last year's economic data?");
      followUpQuestions.push("What factors might explain these economic trends?");
    }
    
    if (lastQuestion.categories.includes('health')) {
      followUpQuestions.push("How do these health outcomes vary by region?");
      followUpQuestions.push("What's the correlation between these health metrics and economic indicators?");
    }
    
    if (lastQuestion.categories.includes('education')) {
      followUpQuestions.push("How do education outcomes correlate with economic development?");
      followUpQuestions.push("Which regions show the strongest education improvements?");
    }
  }
  
  // Add general follow-up questions
  followUpQuestions.push("What are the key factors driving these trends?");
  followUpQuestions.push("How do these results compare across different regions?");
  followUpQuestions.push("What insights can we draw from this data over time?");
  
  // Return a subset of questions (max 4)
  return followUpQuestions.slice(0, 4);
};
