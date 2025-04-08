
import { supabase } from "@/integrations/supabase/client";

// Get category counts for analytics
export const getCategoryCounts = async (): Promise<{ name: string, value: number }[]> => {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('category');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Count occurrences of each category
    const categoryMap: Record<string, number> = {};
    
    data.forEach(item => {
      const category = item.category;
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    // Convert to array format for visualization
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error('Error getting category counts:', error);
    return [];
  }
};
