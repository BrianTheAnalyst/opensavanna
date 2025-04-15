import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dataset } from "@/types/dataset";

// Get dataset visualization data
export const getDatasetVisualization = async (id: string): Promise<any> => {
  try {
    // First, get the dataset to check the category and format
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching dataset:', fetchError);
      toast.error('Failed to load dataset');
      return [];
    }
    
    if (!dataset) {
      toast.error('Dataset not found');
      return [];
    }

    // Check if we have processed data for this dataset
    const { data: processedFiles, error: processedError } = await supabase
      .from('processed_files')
      .select('*')
      .eq('storage_path', `${dataset.id}/%`)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!processedError && processedFiles && processedFiles.length > 0) {
      const processedFile = processedFiles[0];
      
      // If we have a summary with the processed file, use that to generate visualization data
      if (processedFile.summary) {
        const visualizationData = generateVisualizationDataFromSummary(processedFile.summary, dataset.category);
        if (visualizationData.length > 0) {
          return visualizationData;
        }
      }
    }
    
    // If there's a file URL but no processed data, try to fetch and parse the file
    if (dataset.file) {
      try {
        const response = await fetch(dataset.file);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        
        // Handle different file formats
        if (dataset.format.toLowerCase() === 'csv') {
          const text = await response.text();
          return parseCSVData(text, dataset.category);
        } else if (dataset.format.toLowerCase() === 'json') {
          const json = await response.json();
          return formatJSONForVisualization(json, dataset.category);
        } else if (dataset.format.toLowerCase() === 'geojson') {
          const json = await response.json();
          return formatGeoJSONForVisualization(json, dataset.category);
        } else {
          console.log('Unsupported format');
          return [];
        }
      } catch (error) {
        console.error('Error processing dataset file:', error);
        return [];
      }
    } else {
      // No file available
      return [];
    }
  } catch (error) {
    console.error('Error fetching visualization data:', error);
    // Return empty dataset on error
    return [];
  }
};

// Generate visualization data from processed file summary
const generateVisualizationDataFromSummary = (summary: any, category: string): any[] => {
  const result = [];
  
  // For numeric fields, create data points showing distribution
  if (summary.numeric_fields) {
    Object.entries(summary.numeric_fields).forEach(([field, stats]: [string, any]) => {
      result.push({
        name: `${field} (min)`,
        value: stats.min
      });
      result.push({
        name: `${field} (max)`,
        value: stats.max
      });
      result.push({
        name: `${field} (avg)`,
        value: stats.mean
      });
    });
  }
  
  // For categorical fields with distribution data, use that
  if (summary.categorical_fields) {
    Object.entries(summary.categorical_fields).forEach(([field, fieldInfo]: [string, any]) => {
      if (fieldInfo.distribution) {
        // Only take top 10 values for visualization
        const entries = Object.entries(fieldInfo.distribution)
          .sort(([, countA]: [string, number], [, countB]: [string, number]) => (countB as number) - (countA as number))
          .slice(0, 10);
        
        entries.forEach(([value, count]: [string, any]) => {
          result.push({
            name: `${field}: ${value}`,
            value: count
          });
        });
      }
    });
  }
  
  return result.length > 0 ? result : [];
};

// Helper function to parse CSV data
const parseCSVData = (csvText: string, category: string): any[] => {
  // Basic CSV parsing - for production use a robust CSV parser library
  const lines = csvText.split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Convert CSV to array of objects
  const parsedData = lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      // Try to convert numerical values
      const value = values[index];
      obj[header] = !isNaN(Number(value)) ? Number(value) : value;
    });
    return obj;
  });
  
  // Format data for visualization
  return formatDataForVisualization(parsedData, category);
};

// Format JSON data for visualization
const formatJSONForVisualization = (jsonData: any, category: string): any[] => {
  // Handle both array and object formats
  const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  return formatDataForVisualization(dataArray, category);
};

// Format GeoJSON data for visualization
const formatGeoJSONForVisualization = (geoJson: any, category: string): any[] => {
  if (!geoJson.features || !Array.isArray(geoJson.features)) {
    return [];
  }
  
  // Extract properties from features for visualization
  const data = geoJson.features.map((feature: any) => ({
    ...feature.properties,
    geometry_type: feature.geometry?.type
  }));
  
  return formatDataForVisualization(data, category);
};

// Common function to format data for visualization
const formatDataForVisualization = (data: any[], category: string): any[] => {
  // Extract key fields based on category
  if (data.length === 0) return [];
  
  // First, find the numeric field to use for values
  const numericFields = Object.keys(data[0])
    .filter(key => typeof data[0][key] === 'number')
    .sort();
  
  // Then, find a good candidate for the name field
  const nameFieldCandidates = Object.keys(data[0])
    .filter(key => typeof data[0][key] === 'string')
    .sort();
  
  // If we have no numeric fields, we can't create a visualization
  if (numericFields.length === 0) return [];
  
  // Choose appropriate fields based on category and available data
  const valueField = numericFields[0] || 'value';  
  const nameField = nameFieldCandidates[0] || 'index';
  
  // Format the data for visualization, limiting to 20 items
  return data.slice(0, 20).map((item, index) => ({
    name: nameField !== 'index' ? String(item[nameField] || 'Item ' + index) : 'Item ' + index,
    value: Number(item[valueField] || 0),
    // Include original data for reference
    rawData: { ...item }
  }));
};

// Add the missing function that's being imported in datasetService.ts
export const transformSampleDataForCategory = (category: string, data: any[]): any[] => {
  // Basic implementation to transform data based on category
  if (!data || data.length === 0) return [];
  
  // Just return the data as is for now - this function would normally customize
  // the visualization data based on the category
  return data.map(item => ({
    ...item,
    // Apply any category-specific transformations here
    value: typeof item.value === 'number' ? item.value : 0
  }));
};
