
// Transform sample data based on category
export const transformSampleDataForCategory = (category: string, data: any[]): any[] => {
  // Basic implementation to transform data based on category
  if (!data || data.length === 0) return [];
  
  // Return the data with category-specific transformations
  return data.map(item => ({
    ...item,
    value: typeof item.value === 'number' ? item.value : 0
  }));
};
