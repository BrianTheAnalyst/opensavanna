
// This file manages the conversation context and visual history tracking

export interface ConversationItem {
  question: string;
  answer: string;
  timestamp: number;
  insights: string[];
  visualizations: any[];
  datasetIds?: string[]; // IDs of datasets used in this conversation
}

export interface ConversationContext {
  history: ConversationItem[];
  currentDatasets?: string[]; // Current active dataset IDs
}

// In-memory store for conversation history
const conversationHistory: ConversationItem[] = [];
const MAX_HISTORY_LENGTH = 20; // Increased from 5 to store more history items

// Add an item to the conversation history
export const addToConversationHistory = (question: string, result: any) => {
  // Create a history item with visual elements tracked
  const historyItem: ConversationItem = {
    question,
    answer: result.answer,
    timestamp: Date.now(),
    insights: result.insights || [],
    visualizations: result.visualizations || [],
    datasetIds: result.datasets ? result.datasets.map((d: any) => d.id) : []
  };
  
  // Add to history and keep limited length
  conversationHistory.unshift(historyItem);
  
  // Limit history length
  if (conversationHistory.length > MAX_HISTORY_LENGTH) {
    conversationHistory.pop();
  }
  
  // Save to local storage for persistence
  try {
    localStorage.setItem('data_query_history', JSON.stringify(conversationHistory));
  } catch (error) {
    console.error("Failed to save conversation history to local storage:", error);
  }
};

// Get recent conversation history
export const getConversationContext = (): ConversationContext => {
  // Try to load from localStorage first if available
  if (conversationHistory.length === 0 && typeof localStorage !== 'undefined') {
    try {
      const savedHistory = localStorage.getItem('data_query_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          conversationHistory.push(...parsed.slice(0, MAX_HISTORY_LENGTH));
        }
      }
    } catch (error) {
      console.error("Failed to load conversation history from local storage:", error);
    }
  }
  
  return {
    history: conversationHistory,
    currentDatasets: conversationHistory[0]?.datasetIds
  };
};

// Clear conversation history
export const clearConversationHistory = (): void => {
  // Clear in-memory history
  conversationHistory.length = 0;
  
  // Clear from local storage
  try {
    localStorage.removeItem('data_query_history');
  } catch (error) {
    console.error("Failed to clear conversation history from local storage:", error);
  }
};

// Get related questions based on conversation history
export const getRelatedQuestions = async (query: string): Promise<string[]> => {
  // Default questions if we can't generate context-aware ones
  const defaults = [
    "How has this changed over the past year?",
    "What factors are driving these trends?",
    "How does this compare to other regions?",
    "What are the implications for policy decisions?"
  ];
  
  // If no history, return defaults
  if (conversationHistory.length === 0) {
    return defaults;
  }
  
  // Generate questions based on history and current query
  try {
    // Extract topics from current query and history
    const topics = extractTopicsFromQuery(query);
    const historyTopics = conversationHistory
      .map(item => extractTopicsFromQuery(item.question))
      .flat();
    
    // Combine all unique topics
    const allTopics = [...new Set([...topics, ...historyTopics])];
    
    if (allTopics.length === 0) return defaults;
    
    // Generate questions based on topics and visualization types
    const questions = generateQuestionsFromTopics(allTopics, conversationHistory);
    
    return questions.length > 0 ? questions : defaults;
  } catch (error) {
    console.error("Error generating related questions:", error);
    return defaults;
  }
};

// Extract topics from a query string
const extractTopicsFromQuery = (query: string): string[] => {
  // Simple keyword extraction (in a real system, this would be more sophisticated)
  const keywords = query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3) // Only words longer than 3 chars
    .filter(word => !['what', 'where', 'when', 'which', 'show', 'tell', 'find', 'list', 'give'].includes(word));
  
  return [...new Set(keywords)];
};

// Generate questions from topic list and history
const generateQuestionsFromTopics = (topics: string[], history: ConversationItem[]): string[] => {
  const questions: string[] = [];
  const recentVisualizationTypes = new Set<string>();
  
  // Collect recent visualization types
  history.forEach(item => {
    item.visualizations?.forEach(viz => {
      if (viz.type) recentVisualizationTypes.add(viz.type);
    });
  });
  
  // Generate time-related questions
  if (topics.some(topic => ['trend', 'growth', 'change', 'increase', 'decrease'].includes(topic))) {
    questions.push(`How have ${topics[0]} patterns evolved over the past decade?`);
  }
  
  // Generate comparison questions
  if (topics.length > 0) {
    questions.push(`How does ${topics[0]} compare across different regions?`);
  }
  
  // Generate correlation questions
  if (topics.length > 1) {
    questions.push(`What is the relationship between ${topics[0]} and ${topics[1]}?`);
  }
  
  // Generate visualization-specific questions
  if (recentVisualizationTypes.has('map')) {
    questions.push(`What geographic patterns exist in the ${topics[0] || 'data'}?`);
  }
  
  if (recentVisualizationTypes.has('bar') || recentVisualizationTypes.has('pie')) {
    questions.push(`What are the top factors influencing ${topics[0] || 'this trend'}?`);
  }
  
  // Generate prediction questions
  questions.push(`What are the projected ${topics[0] || ''} trends for next year?`);
  
  // Add questions based on history analysis
  if (history.length >= 2) {
    // Look for topics mentioned across multiple questions
    const repeatedTopics = topics.filter(topic => 
      history.filter(item => item.question.toLowerCase().includes(topic)).length >= 2
    );
    
    if (repeatedTopics.length > 0) {
      questions.push(`What deeper insights can we find about ${repeatedTopics[0]}?`);
    }
  }
  
  // Return unique questions, limit to 5
  return [...new Set(questions)].slice(0, 5);
};

// Extract keywords from a query for context matching
export const extractKeywords = (query: string): string[] => {
  // This is a simple extraction - in production this would be more sophisticated
  return query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3)
    .filter(word => !['what', 'where', 'when', 'which', 'show', 'tell', 'find', 'about', 'would', 'could', 'should', 'from'].includes(word));
};
