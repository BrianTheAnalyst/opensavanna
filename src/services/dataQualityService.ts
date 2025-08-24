/**
 * Calculates the percentage of missing values for each column in a dataset.
 * @param data An array of objects representing the dataset.
 * @returns An object where keys are column names and values are the percentage of missing values.
 */
export const calculateMissingValues = (data: any[]): { [key: string]: number } => {
  if (!data || data.length === 0) {
    return {};
  }

  const columnCounts: { [key: string]: number } = {};
  const missingCounts: { [key: string]: number } = {};
  const allKeys = new Set<string>();

  // First, get all possible keys, as some rows might be missing entire columns
  data.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });

  // Initialize counts for all columns
  allKeys.forEach(key => {
    columnCounts[key] = 0;
    missingCounts[key] = 0;
  });

  // Iterate over the data to count missing values
  data.forEach(row => {
    allKeys.forEach(key => {
      columnCounts[key]++;
      if (row[key] === null || row[key] === undefined || row[key] === '') {
        missingCounts[key]++;
      }
    });
  });

  // Calculate percentages
  const missingPercentages: { [key: string]: number } = {};
  allKeys.forEach(key => {
    missingPercentages[key] = (missingCounts[key] / columnCounts[key]) * 100;
  });

  return missingPercentages;
};

/**
 * Detects data type inconsistencies in each column of a dataset.
 * @param data An array of objects representing the dataset.
 * @returns An object where keys are column names and values are objects detailing the data types found and their counts.
 */
export const detectDataTypeInconsistencies = (data: any[]): { [key: string]: { [type: string]: number } } => {
  if (!data || data.length === 0) {
    return {};
  }

  const typeCounts: { [key: string]: { [type: string]: number } } = {};
  const allKeys = new Set<string>();

  data.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });

  allKeys.forEach(key => {
    typeCounts[key] = {};
  });

  data.forEach(row => {
    allKeys.forEach(key => {
      const value = row[key];
      let type: string;
      if (value === null || value === undefined) {
        type = 'null';
      } else if (Array.isArray(value)) {
        type = 'array';
      } else {
        type = typeof value;
      }

      if (!typeCounts[key][type]) {
        typeCounts[key][type] = 0;
      }
      typeCounts[key][type]++;
    });
  });

  return typeCounts;
};

/**
 * Finds and counts duplicate records in a dataset.
 * @param data An array of objects representing the dataset.
 * @returns The number of duplicate records found.
 */
export const findDuplicateRecords = (data: any[]): number => {
  if (!data || data.length === 0) {
    return 0;
  }

  const seen = new Set<string>();
  let duplicateCount = 0;

  data.forEach(row => {
    const rowString = JSON.stringify(row);
    if (seen.has(rowString)) {
      duplicateCount++;
    } else {
      seen.add(rowString);
    }
  });

  return duplicateCount;
};
