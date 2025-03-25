
import { toast } from "sonner";

// Types for our dataset
export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number;
  featured?: boolean;
  file?: string;
}

// Sample dataset that we'll use as mock data
const sampleDatasets: Dataset[] = [
  {
    id: '1',
    title: 'Economic Indicators by Region',
    description: 'Comprehensive collection of economic indicators across different regions including GDP, inflation, and employment rates.',
    category: 'Economics',
    format: 'CSV',
    country: 'Global',
    date: 'Updated June 2023',
    downloads: 5248,
    featured: true
  },
  {
    id: '2',
    title: 'Healthcare Facility Locations',
    description: 'Geographic dataset of healthcare facilities including hospitals, clinics, and specialized care centers.',
    category: 'Health',
    format: 'GeoJSON',
    country: 'South Africa',
    date: 'Updated May 2023',
    downloads: 3129
  },
  {
    id: '3',
    title: 'Public Transportation Usage',
    description: 'Time series data showing public transportation usage patterns across major metropolitan areas.',
    category: 'Transport',
    format: 'JSON',
    country: 'Nigeria',
    date: 'Updated April 2023',
    downloads: 2847
  },
  {
    id: '4',
    title: 'Agricultural Production Statistics',
    description: 'Annual agricultural production statistics for major crops and livestock by region.',
    category: 'Agriculture',
    format: 'CSV',
    country: 'Kenya',
    date: 'Updated March 2023',
    downloads: 2156
  },
  {
    id: '5',
    title: 'Education Access and Completion Rates',
    description: 'Data on education access, enrollment, and completion rates across different regions and demographics.',
    category: 'Education',
    format: 'CSV',
    country: 'Ghana',
    date: 'Updated June 2023',
    downloads: 1845
  },
  {
    id: '6',
    title: 'Climate Data by Region',
    description: 'Time series climate data including temperature, precipitation, and other environmental indicators.',
    category: 'Environment',
    format: 'JSON',
    country: 'East Africa',
    date: 'Updated May 2023',
    downloads: 1732
  },
  {
    id: '7',
    title: 'Population Demographics',
    description: 'Demographic data including age distribution, gender ratios, and population density by region.',
    category: 'Demographics',
    format: 'CSV',
    country: 'West Africa',
    date: 'Updated April 2023',
    downloads: 1621
  },
  {
    id: '8',
    title: 'COVID-19 Case Statistics',
    description: 'Historical data on COVID-19 cases, hospitalizations, recoveries, and vaccination rates.',
    category: 'Health',
    format: 'CSV',
    country: 'Africa',
    date: 'Updated March 2023',
    downloads: 1597
  },
  {
    id: '9',
    title: 'Election Results and Voting Patterns',
    description: 'Historical election results, voter turnout, and voting patterns by region.',
    category: 'Government',
    format: 'JSON',
    country: 'Nigeria',
    date: 'Updated February 2023',
    downloads: 1483
  }
];

// Mock visualization data
export const sampleVisData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 700 },
];

// Local storage key for our datasets
const STORAGE_KEY = 'africa_open_data_datasets';

// Initialize local storage with sample data if empty
const initializeStorage = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDatasets));
  }
};

// Get all datasets with optional filtering
export const getDatasets = async (
  filters?: { 
    search?: string; 
    category?: string; 
    format?: string;
    country?: string;
  }
): Promise<Dataset[]> => {
  initializeStorage();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Dataset[];
    
    if (!filters) return data;
    
    // Apply filters if provided
    return data.filter(dataset => {
      // Search filter (search in title and description)
      if (filters.search && !dataset.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !dataset.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && dataset.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
      
      // Format filter
      if (filters.format && dataset.format.toLowerCase() !== filters.format.toLowerCase()) {
        return false;
      }
      
      // Country filter
      if (filters.country && dataset.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    toast.error('Failed to load datasets');
    return [];
  }
};

// Get a single dataset by ID
export const getDatasetById = async (id: string): Promise<Dataset | null> => {
  initializeStorage();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Dataset[];
    const dataset = data.find(item => item.id === id);
    
    if (!dataset) {
      toast.error('Dataset not found');
      return null;
    }
    
    return dataset;
  } catch (error) {
    console.error('Error fetching dataset:', error);
    toast.error('Failed to load dataset');
    return null;
  }
};

// Add a new dataset
export const addDataset = async (dataset: Omit<Dataset, 'id' | 'date' | 'downloads'>): Promise<Dataset> => {
  initializeStorage();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Dataset[];
    
    // Create new dataset with generated ID and other default values
    const newDataset: Dataset = {
      ...dataset,
      id: Date.now().toString(),
      date: `Updated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      downloads: 0
    };
    
    // Add to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newDataset, ...data]));
    
    toast.success('Dataset added successfully');
    return newDataset;
  } catch (error) {
    console.error('Error adding dataset:', error);
    toast.error('Failed to add dataset');
    throw error;
  }
};

// Get dataset visualization data
export const getDatasetVisualization = async (id: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock visualization data
  return sampleVisData;
};

// Download a dataset (in a real app, this would generate a download)
export const downloadDataset = async (id: string): Promise<void> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update download count
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Dataset[];
    const updatedData = data.map(item => {
      if (item.id === id) {
        return { ...item, downloads: item.downloads + 1 };
      }
      return item;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    toast.success('Dataset download started');
  } catch (error) {
    console.error('Error downloading dataset:', error);
    toast.error('Failed to download dataset');
  }
};
