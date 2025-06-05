
// Suggested queries service
export const getSuggestedQuestions = async (): Promise<string[]> => {
  // Return a diverse set of analytical questions
  const questions = [
    "What are the key trends in this data over time?",
    "How do values compare across different regions?",
    "What spatial patterns can we identify?",
    "Which factors show the strongest correlations?",
    "What are the outliers and anomalies in this dataset?",
    "How has the distribution changed over the years?",
    "What seasonal patterns exist in the data?",
    "Which geographic areas show the highest values?",
    "What are the growth rates by category?",
    "How do urban and rural areas compare?",
    "What demographic factors influence these metrics?",
    "Which time periods show significant changes?"
  ];
  
  // Return a random subset to avoid repetition
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
};

// Generate contextual follow-up questions based on current query
export const generateFollowUpQuestions = (currentQuery: string, category: string): string[] => {
  const baseQuestions = [
    `What factors are driving changes in ${category.toLowerCase()}?`,
    `How do these ${category.toLowerCase()} patterns vary by region?`,
    `What predictions can we make about future ${category.toLowerCase()} trends?`,
    `Which ${category.toLowerCase()} indicators are most significant?`
  ];
  
  // Add category-specific questions
  const categoryQuestions: Record<string, string[]> = {
    'economics': [
      "What economic policies might explain these patterns?",
      "How do global events correlate with these economic trends?",
      "Which economic sectors show the most growth potential?"
    ],
    'health': [
      "What public health interventions might be most effective?",
      "How do healthcare access patterns affect these outcomes?",
      "What demographic groups need the most attention?"
    ],
    'education': [
      "What educational reforms could improve these metrics?",
      "How do socioeconomic factors influence education outcomes?",
      "Which age groups show the most promising trends?"
    ],
    'transport': [
      "What infrastructure investments would be most impactful?",
      "How do transportation patterns affect economic development?",
      "Which transport modes are becoming more sustainable?"
    ],
    'environment': [
      "What conservation strategies are most effective?",
      "How do climate patterns correlate with these indicators?",
      "Which environmental policies show the best results?"
    ]
  };
  
  const specificQuestions = categoryQuestions[category.toLowerCase()] || [];
  const allQuestions = [...baseQuestions, ...specificQuestions];
  
  // Filter out questions too similar to current query
  const filtered = allQuestions.filter(q => 
    !q.toLowerCase().includes(currentQuery.toLowerCase().substring(0, 20))
  );
  
  // Return 3-4 unique questions
  return filtered.slice(0, 4);
};
