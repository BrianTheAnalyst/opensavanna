
/**
 * Generate summary statistics for a dataset
 */
export const generateDataSummary = (data: any[]): any => {
  if (!data.length) return {};

  const fields = Object.keys(data[0]);
  const summary: Record<string, any> = {
    row_count: data.length,
    fields: fields,
    field_types: {},
    numeric_fields: {},
    categorical_fields: {}
  };
  
  // Analyze each field
  fields.forEach(field => {
    const values = data.map(row => row[field]).filter(v => v !== null && v !== undefined);
    
    if (values.length === 0) {
      summary.field_types[field] = 'empty';
      return;
    }
    
    // Determine field type
    const firstNonNull = values.find(v => v !== null && v !== undefined);
    const type = typeof firstNonNull;
    summary.field_types[field] = type;
    
    // Calculate statistics based on type
    if (type === 'number') {
      const numericValues = values.filter(v => typeof v === 'number');
      
      if (numericValues.length > 0) {
        summary.numeric_fields[field] = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
          median: calculateMedian(numericValues),
          has_negative: numericValues.some(v => v < 0),
          has_decimal: numericValues.some(v => !Number.isInteger(v))
        };
      }
    } else if (type === 'string') {
      const stringValues = values.filter(v => typeof v === 'string');
      const uniqueValues = [...new Set(stringValues)];
      
      summary.categorical_fields[field] = {
        unique_count: uniqueValues.length,
        most_common: findMostCommon(stringValues),
        is_date: stringValues.every(isDateString),
        avg_length: stringValues.reduce((sum, val) => sum + val.length, 0) / stringValues.length,
      };
      
      // If there are few unique values, include distribution
      if (uniqueValues.length <= 20) {
        const distribution: Record<string, number> = {};
        stringValues.forEach(val => {
          distribution[val] = (distribution[val] || 0) + 1;
        });
        summary.categorical_fields[field].distribution = distribution;
      }
    }
  });
  
  return summary;
};

/**
 * Calculate the median of an array of numbers
 */
export const calculateMedian = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

/**
 * Find the most common value in an array
 */
export const findMostCommon = (values: any[]): any => {
  const counts: Record<string, number> = {};
  
  values.forEach(value => {
    const key = String(value);
    counts[key] = (counts[key] || 0) + 1;
  });
  
  let mostCommon = null;
  let maxCount = 0;
  
  Object.entries(counts).forEach(([value, count]) => {
    if (count > maxCount) {
      mostCommon = value;
      maxCount = count;
    }
  });
  
  return { value: mostCommon, count: maxCount };
};

/**
 * Check if a string is likely a date
 */
export const isDateString = (str: string): boolean => {
  // Simple regex to catch common date formats
  const datePatterns = [
    /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
    /^\d{1,2}-\d{1,2}-\d{4}$/, // DD-MM-YYYY or MM-DD-YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
    /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
  ];
  
  return datePatterns.some(pattern => pattern.test(str)) && !isNaN(Date.parse(str));
};

/**
 * Calculate geographic bounds for GeoJSON data
 */
export const calculateGeoBounds = (geoJson: any): any => {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  
  // Helper function to process a single coordinate pair
  const processCoord = (coord: number[]) => {
    if (coord.length >= 2) {
      minLon = Math.min(minLon, coord[0]);
      maxLon = Math.max(maxLon, coord[0]);
      minLat = Math.min(minLat, coord[1]);
      maxLat = Math.max(maxLat, coord[1]);
    }
  };
  
  // Helper function to process coordinates recursively
  const processCoordinates = (coords: any, depth: number = 0) => {
    if (!coords) return;
    
    if (Array.isArray(coords)) {
      if (depth > 0 && typeof coords[0] === 'number') {
        processCoord(coords);
      } else {
        coords.forEach(c => processCoordinates(c, depth + 1));
      }
    }
  };
  
  // Process features
  geoJson.features.forEach((feature: any) => {
    if (feature.geometry && feature.geometry.coordinates) {
      processCoordinates(feature.geometry.coordinates);
    }
  });
  
  return {
    min_longitude: minLon !== Infinity ? minLon : null,
    max_longitude: maxLon !== -Infinity ? maxLon : null, 
    min_latitude: minLat !== Infinity ? minLat : null,
    max_latitude: maxLat !== -Infinity ? maxLat : null
  };
};
