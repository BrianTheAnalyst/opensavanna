import Papa from 'papaparse';

export interface ParsedDataPoint {
  [key: string]: any;
  _originalIndex?: number;
}

export interface DataParseResult {
  data: ParsedDataPoint[];
  columns: string[];
  numericColumns: string[];
  dateColumns: string[];
  categoricalColumns: string[];
  totalRows: number;
  summary: {
    [column: string]: {
      type: 'numeric' | 'date' | 'categorical' | 'text';
      uniqueValues?: number;
      min?: number;
      max?: number;
      mean?: number;
      mode?: string;
      nullCount: number;
    };
  };
}

export const parseDataFromFile = async (content: string, format: string): Promise<DataParseResult> => {
  let rawData: any[] = [];
  
  try {
    if (format.toLowerCase() === 'csv') {
      const result = Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });
      rawData = result.data as any[];
    } else if (format.toLowerCase() === 'json') {
      const parsed = JSON.parse(content);
      rawData = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Error parsing data:', error);
    throw new Error('Failed to parse data file');
  }

  if (rawData.length === 0) {
    throw new Error('No data found in file');
  }

  // Add original index for tracking
  const dataWithIndex = rawData.map((row, index) => ({
    ...row,
    _originalIndex: index
  }));

  // Analyze columns and data types
  const columns = Object.keys(rawData[0] || {});
  const analysis = analyzeColumns(dataWithIndex, columns);

  return {
    data: dataWithIndex,
    columns,
    numericColumns: analysis.numericColumns,
    dateColumns: analysis.dateColumns,
    categoricalColumns: analysis.categoricalColumns,
    totalRows: rawData.length,
    summary: analysis.summary
  };
};

const analyzeColumns = (data: ParsedDataPoint[], columns: string[]) => {
  const numericColumns: string[] = [];
  const dateColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const summary: DataParseResult['summary'] = {};

  columns.forEach(column => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
    const nonNullCount = values.length;
    const nullCount = data.length - nonNullCount;

    if (values.length === 0) {
      summary[column] = { type: 'text', nullCount, uniqueValues: 0 };
      return;
    }

    // Check if it's numeric
    const numericValues = values.map(val => parseFloat(String(val))).filter(val => !isNaN(val));
    const isNumeric = numericValues.length > values.length * 0.8; // 80% threshold

    if (isNumeric) {
      numericColumns.push(column);
      summary[column] = {
        type: 'numeric',
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
        uniqueValues: new Set(numericValues).size,
        nullCount
      };
      return;
    }

    // Check if it's a date
    const dateValues = values.filter(val => {
      const date = new Date(String(val));
      return !isNaN(date.getTime());
    });
    const isDate = dateValues.length > values.length * 0.6; // 60% threshold

    if (isDate) {
      dateColumns.push(column);
      summary[column] = {
        type: 'date',
        uniqueValues: new Set(dateValues).size,
        nullCount
      };
      return;
    }

    // Otherwise, it's categorical
    categoricalColumns.push(column);
    const uniqueValues = new Set(values.map(val => String(val)));
    const mode = getMostFrequent(values.map(val => String(val)));
    
    summary[column] = {
      type: 'categorical',
      uniqueValues: uniqueValues.size,
      mode,
      nullCount
    };
  });

  return { numericColumns, dateColumns, categoricalColumns, summary };
};

const getMostFrequent = (values: string[]): string => {
  const frequency: { [key: string]: number } = {};
  values.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  
  let maxCount = 0;
  let mode = '';
  Object.entries(frequency).forEach(([val, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mode = val;
    }
  });
  
  return mode;
};
