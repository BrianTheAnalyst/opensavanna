import { format } from 'date-fns';

// Enhanced data transformation for better visualizations
export const transformDataForVisualization = (data: any[], category: string, query: string): any[] => {
  if (!data || data.length === 0) return [];
  
  // Clean and prepare data
  const cleanedData = data.filter(item => item && typeof item === 'object');
  
  // If data is already in the right format, enhance it
  if (cleanedData.every(item => item.name && item.value !== undefined)) {
    return cleanedData.map(item => ({
      ...item,
      value: typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value,
      formattedValue: formatValue(item.value, category)
    }));
  }
  
  // Transform raw data based on category and query context
  return transformRawData(cleanedData, category, query);
};

// Transform raw data into visualization-ready format
const transformRawData = (data: any[], category: string, query: string): any[] => {
  const sample = data[0];
  if (!sample) return [];
  
  const keys = Object.keys(sample);
  const numericKeys = keys.filter(key => {
    const values = data.map(item => item[key]).filter(v => v !== null && v !== undefined);
    return values.length > 0 && values.every(v => !isNaN(Number(v)));
  });
  
  const categoryKeys = keys.filter(key => 
    typeof sample[key] === 'string' && !numericKeys.includes(key)
  );
  
  // For time series queries, look for date/time fields
  if (isTimeSeriesQuery(query)) {
    const timeKey = findTimeField(keys, data);
    const valueKey = findBestValueField(numericKeys, category, query);
    
    if (timeKey && valueKey) {
      return data.map(item => ({
        name: formatTimeValue(item[timeKey]),
        value: Number(item[valueKey]) || 0,
        formattedValue: formatValue(item[valueKey], category),
        timeStamp: item[timeKey]
      })).sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());
    }
  }
  
  // For categorical data
  if (categoryKeys.length > 0 && numericKeys.length > 0) {
    const categoryKey = categoryKeys[0];
    const valueKey = findBestValueField(numericKeys, category, query);
    
    return data.slice(0, 10).map(item => ({
      name: String(item[categoryKey]),
      value: Number(item[valueKey]) || 0,
      formattedValue: formatValue(item[valueKey], category)
    }));
  }
  
  // Aggregate numeric data if no clear categories
  if (numericKeys.length > 0) {
    return numericKeys.slice(0, 6).map(key => {
      const values = data.map(item => Number(item[key]) || 0);
      const total = values.reduce((sum, val) => sum + val, 0);
      const avg = total / values.length;
      
      return {
        name: formatFieldName(key),
        value: avg,
        formattedValue: formatValue(avg, category),
        total,
        count: values.length
      };
    });
  }
  
  return [];
};

// Determine if query is asking for time series data
const isTimeSeriesQuery = (query: string): boolean => {
  const timeKeywords = ['trend', 'over time', 'historical', 'timeline', 'change', 'growth', 
                       'monthly', 'yearly', 'quarterly', 'daily', 'progress', 'evolution'];
  return timeKeywords.some(keyword => query.toLowerCase().includes(keyword));
};

// Find time/date field in data
const findTimeField = (keys: string[], data: any[]): string | null => {
  const timeKeys = ['date', 'time', 'created_at', 'updated_at', 'timestamp', 'year', 'month'];
  
  for (const key of keys) {
    if (timeKeys.some(tk => key.toLowerCase().includes(tk))) {
      // Validate it contains date-like values
      const sample = data[0][key];
      if (sample && (sample instanceof Date || !isNaN(Date.parse(sample)))) {
        return key;
      }
    }
  }
  return null;
};

// Find the most relevant numeric field based on context
const findBestValueField = (numericKeys: string[], category: string, query: string): string => {
  const queryLower = query.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  // Priority fields based on common data patterns
  const priorityPatterns = {
    economic: ['gdp', 'income', 'revenue', 'cost', 'price', 'value', 'amount'],
    health: ['rate', 'percentage', 'count', 'cases', 'deaths', 'births'],
    education: ['enrollment', 'rate', 'percentage', 'score', 'count'],
    transport: ['count', 'volume', 'capacity', 'distance'],
    environment: ['level', 'concentration', 'temperature', 'pressure']
  };
  
  // Check query-specific terms
  for (const key of numericKeys) {
    if (queryLower.includes(key.toLowerCase())) {
      return key;
    }
  }
  
  // Check category-specific patterns
  const patterns = priorityPatterns[categoryLower as keyof typeof priorityPatterns] || [];
  for (const pattern of patterns) {
    const match = numericKeys.find(key => key.toLowerCase().includes(pattern));
    if (match) return match;
  }
  
  // Default to first numeric field
  return numericKeys[0];
};

// Format time values for display
const formatTimeValue = (timeValue: any): string => {
  if (!timeValue) return 'Unknown';
  
  const date = new Date(timeValue);
  if (isNaN(date.getTime())) return String(timeValue);
  
  // Format based on date precision
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  
  if (year < 1900 || year > currentYear + 10) {
    return String(timeValue); // Probably not a real date
  }
  
  return format(date, 'MMM yyyy');
};

// Enhanced value formatting based on category and magnitude
const formatValue = (value: any, category: string): string => {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  
  const categoryLower = category.toLowerCase();
  
  // Currency formatting for economic data
  if (categoryLower.includes('economic') || categoryLower.includes('financial')) {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  }
  
  // Percentage formatting for rates
  if (categoryLower.includes('rate') || categoryLower.includes('percentage')) {
    return `${num.toFixed(1)}%`;
  }
  
  // General number formatting
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
};

// Format field names for better readability
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

// Enhanced chart type determination with better logic
export const determineVisualizationType = (query: string, category: string, data: any[]): 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'map' => {
  const queryLower = query.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  // Time series detection
  if (isTimeSeriesQuery(query) || (data.length > 0 && hasTimeData(data))) {
    return 'line';
  }
  
  // Geographic detection
  const geoKeywords = ['map', 'location', 'where', 'region', 'country', 'geographic', 'spatial'];
  if (geoKeywords.some(keyword => queryLower.includes(keyword)) || 
      categoryLower.includes('geo') || categoryLower.includes('map')) {
    return 'map';
  }
  
  // Distribution/proportion detection
  if (queryLower.includes('distribution') || queryLower.includes('proportion') || 
      queryLower.includes('breakdown') || queryLower.includes('share')) {
    return 'pie';
  }
  
  // Comparison detection
  if (queryLower.includes('compare') || queryLower.includes('versus') || 
      queryLower.includes('vs') || queryLower.includes('between')) {
    return 'bar';
  }
  
  // Default based on data characteristics
  if (data.length <= 6) return 'pie';
  if (data.length > 15) return 'line';
  
  return 'bar';
};

// Check if data contains time information
const hasTimeData = (data: any[]): boolean => {
  if (!data.length) return false;
  
  const sample = data[0];
  const keys = Object.keys(sample);
  
  return keys.some(key => {
    const value = sample[key];
    return value && !isNaN(Date.parse(value));
  });
};

// Generate intelligent axis labels
export const generateAxisLabels = (data: any[], category: string, query: string, vizType: string) => {
  const queryLower = query.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  let xAxisLabel = 'Category';
  let yAxisLabel = 'Value';
  
  if (vizType === 'line') {
    xAxisLabel = 'Time Period';
    
    // Determine Y-axis based on context
    if (categoryLower.includes('economic')) {
      yAxisLabel = queryLower.includes('growth') ? 'Growth Rate (%)' : 'Economic Value';
    } else if (categoryLower.includes('health')) {
      yAxisLabel = 'Health Metric';
    } else if (categoryLower.includes('education')) {
      yAxisLabel = 'Education Rate (%)';
    } else {
      yAxisLabel = 'Value Over Time';
    }
  } else {
    // For bar/pie charts, analyze the data structure
    if (data.length > 0) {
      const firstItem = data[0];
      
      // Try to infer from data keys
      if (firstItem.name && typeof firstItem.name === 'string') {
        if (firstItem.name.includes('Q1') || firstItem.name.includes('Jan')) {
          xAxisLabel = 'Time Period';
        } else if (firstItem.name.includes('%')) {
          xAxisLabel = 'Categories';
          yAxisLabel = 'Percentage';
        }
      }
      
      // Context-based labeling
      if (queryLower.includes('country') || queryLower.includes('region')) {
        xAxisLabel = 'Geographic Region';
      } else if (queryLower.includes('sector') || queryLower.includes('industry')) {
        xAxisLabel = 'Sector';
      }
      
      // Y-axis based on category
      if (categoryLower.includes('economic') && queryLower.includes('gdp')) {
        yAxisLabel = 'GDP (Billions USD)';
      } else if (categoryLower.includes('health') && queryLower.includes('rate')) {
        yAxisLabel = 'Rate (%)';
      } else if (queryLower.includes('population')) {
        yAxisLabel = 'Population (Millions)';
      }
    }
  }
  
  return { xAxisLabel, yAxisLabel };
};

// Enhanced time series data generation
export const generateTimeSeriesData = (query: string, baseData: any[], category: string): any[] => {
  // If we already have proper time series data, enhance it
  if (baseData.some(item => item.timeStamp || item.name?.match(/\d{4}|Q\d|Jan|Feb|Mar/))) {
    return baseData.map(item => ({
      ...item,
      formattedValue: formatValue(item.value, category)
    }));
  }
  
  const queryLower = query.toLowerCase();
  const useQuarters = queryLower.includes('quarter') || queryLower.includes('quarterly');
  const currentYear = new Date().getFullYear();
  
  if (useQuarters) {
    return generateQuarterlyData(currentYear, category, query);
  } else {
    return generateMonthlyData(currentYear, category, query);
  }
};

// Generate realistic quarterly data
const generateQuarterlyData = (year: number, category: string, query: string): any[] => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const baseValue = getBaseValueForCategory(category);
  
  return quarters.flatMap(quarter => 
    [year - 1, year].map(y => {
      const seasonalMultiplier = getSeasonalMultiplier(quarter, category);
      const trendMultiplier = y === year ? 1.1 : 1.0; // 10% growth year-over-year
      const randomFactor = 0.9 + Math.random() * 0.2; // ±10% variation
      
      const value = Math.round(baseValue * seasonalMultiplier * trendMultiplier * randomFactor);
      
      return {
        name: `${quarter} ${y}`,
        value,
        formattedValue: formatValue(value, category),
        timeStamp: new Date(y, (parseInt(quarter.slice(1)) - 1) * 3, 1).toISOString()
      };
    })
  );
};

// Generate realistic monthly data
const generateMonthlyData = (year: number, category: string, query: string): any[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseValue = getBaseValueForCategory(category);
  
  return months.map((month, index) => {
    const seasonalMultiplier = getMonthlySeasonalMultiplier(index, category);
    const trendMultiplier = 1 + (index * 0.01); // 1% monthly growth
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    const value = Math.round(baseValue * seasonalMultiplier * trendMultiplier * randomFactor);
    
    return {
      name: `${month} ${year}`,
      value,
      formattedValue: formatValue(value, category),
      timeStamp: new Date(year, index, 1).toISOString()
    };
  });
};

// Get appropriate base values for different categories
const getBaseValueForCategory = (category: string): number => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic')) return 2500;
  if (categoryLower.includes('health')) return 75;
  if (categoryLower.includes('education')) return 85;
  if (categoryLower.includes('transport')) return 1200;
  if (categoryLower.includes('environment')) return 45;
  
  return 100;
};

// Seasonal multipliers for quarterly data
const getSeasonalMultiplier = (quarter: string, category: string): number => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic')) {
    return { Q1: 0.95, Q2: 1.0, Q3: 1.05, Q4: 1.15 }[quarter] || 1.0;
  }
  
  if (categoryLower.includes('health')) {
    return { Q1: 1.1, Q2: 0.9, Q3: 0.85, Q4: 1.05 }[quarter] || 1.0;
  }
  
  return { Q1: 0.9, Q2: 1.0, Q3: 1.1, Q4: 1.0 }[quarter] || 1.0;
};

// Monthly seasonal multipliers
const getMonthlySeasonalMultiplier = (monthIndex: number, category: string): number => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('economic')) {
    const multipliers = [0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.95, 1.0, 1.1, 1.15, 1.2];
    return multipliers[monthIndex] || 1.0;
  }
  
  return 0.9 + Math.random() * 0.2; // Default seasonal variation
};

// Add the missing generateComparison function
export const generateComparison = (
  data1: any[], 
  data2: any[], 
  category: string
): string => {
  if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
    return 'Insufficient data for comparison.';
  }
  
  try {
    const avg1 = data1.reduce((sum, item) => sum + (item.value || 0), 0) / data1.length;
    const avg2 = data2.reduce((sum, item) => sum + (item.value || 0), 0) / data2.length;
    
    const difference = Math.abs(avg1 - avg2);
    const percentDiff = ((difference / Math.min(avg1, avg2)) * 100).toFixed(1);
    
    const higher = avg1 > avg2 ? 'first dataset' : 'second dataset';
    
    return `Comparison shows the ${higher} has ${percentDiff}% higher average values in ${category} metrics.`;
  } catch (error) {
    console.error('Error generating comparison:', error);
    return 'Unable to generate comparison.';
  }
};
