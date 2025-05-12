
import { toast } from 'sonner';

// Function to handle chart data download
export const downloadChartData = (chartData: any[]) => {
  try {
    // Create CSV content
    const headers = Object.keys(chartData[0]).join(',');
    const rows = chartData.map(item => Object.values(item).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chart-data-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Data downloaded successfully', {
      description: 'CSV file has been saved to your downloads folder'
    });
    console.log('Data download complete');
  } catch (error) {
    console.error('Error downloading data:', error);
    toast.error('Failed to download data');
  }
};

// Sample data if none is provided
export const getSampleData = () => [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 700 },
];

// Colors for charts
export const chartColors = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', 
  '#ec4899', '#f43f5e', '#f97316', '#eab308'
];
