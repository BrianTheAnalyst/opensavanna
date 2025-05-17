
/**
 * Calculate Pearson correlation coefficient between two arrays of numbers
 * 
 * @param x First array of values
 * @param y Second array of values
 * @returns Correlation coefficient between -1 and 1, or null if calculation not possible
 */
export function calculateCorrelation(x: number[], y: number[]): number | null {
  // Arrays must be of equal length and have at least 2 elements
  if (!x || !y || x.length !== y.length || x.length < 2) {
    return null;
  }

  // Calculate means
  const n = x.length;
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate covariance and variances
  let covariance = 0;
  let varianceX = 0;
  let varianceY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    
    covariance += diffX * diffY;
    varianceX += diffX * diffX;
    varianceY += diffY * diffY;
  }

  // If either variance is zero, correlation is undefined
  if (varianceX === 0 || varianceY === 0) {
    return null;
  }

  // Calculate Pearson correlation coefficient
  const correlation = covariance / Math.sqrt(varianceX * varianceY);
  
  // Handle numerical precision issues
  if (correlation > 1) return 1;
  if (correlation < -1) return -1;
  
  return correlation;
}

/**
 * Calculate spatial correlation between two variables across geographic regions
 * 
 * @param regions Array of region objects with properties containing variable values
 * @param var1 Property name for first variable
 * @param var2 Property name for second variable
 * @returns Correlation coefficient between -1 and 1, or null if calculation not possible
 */
export function calculateSpatialCorrelation(
  regions: any[],
  var1: string,
  var2: string
): number | null {
  if (!regions || !Array.isArray(regions) || regions.length < 2) {
    return null;
  }

  // Extract values for the two variables
  const values1: number[] = [];
  const values2: number[] = [];

  for (const region of regions) {
    const val1 = region[var1] !== undefined ? region[var1] : 
                (region.properties && region.properties[var1] !== undefined ? region.properties[var1] : null);
                
    const val2 = region[var2] !== undefined ? region[var2] : 
                (region.properties && region.properties[var2] !== undefined ? region.properties[var2] : null);

    // Only include regions with valid values for both variables
    if (val1 !== null && val2 !== null && 
        typeof val1 === 'number' && typeof val2 === 'number' && 
        !isNaN(val1) && !isNaN(val2)) {
      values1.push(val1);
      values2.push(val2);
    }
  }

  // Calculate correlation between the values
  return calculateCorrelation(values1, values2);
}
