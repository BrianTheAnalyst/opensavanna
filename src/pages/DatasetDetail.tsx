
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Share, Calendar, Users, MapPin, Eye, BarChart3, ArrowLeft, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Visualization from '@/components/Visualization';
import DatasetGrid from '@/components/DatasetGrid';
import Footer from '@/components/Footer';

// Sample data
const sampleDataset = {
  id: '1',
  title: 'Economic Indicators by Region',
  description: 'Comprehensive collection of economic indicators across different regions including GDP, inflation, and employment rates. This dataset provides valuable insights for policymakers, researchers, and businesses looking to understand economic trends and patterns.',
  category: 'Economics',
  format: 'CSV',
  country: 'Global',
  date: 'June 15, 2023',
  lastUpdated: 'August 3, 2023',
  downloads: 5248,
  views: 12597,
  license: 'Creative Commons Attribution 4.0',
  publisher: 'African Development Bank',
  maintainer: 'Open Data Research Team',
  source: 'https://example.com/source',
  tags: ['economics', 'gdp', 'inflation', 'employment', 'trade', 'indicators'],
  fileSize: '12.4 MB',
  dataPoints: '24,568 rows',
  timespan: '2010-2023',
  dataFields: [
    { name: 'Region', description: 'Geographic region or country name', type: 'string' },
    { name: 'Year', description: 'Year of data collection', type: 'integer' },
    { name: 'GDP', description: 'Gross Domestic Product in USD', type: 'float' },
    { name: 'GDPGrowth', description: 'Annual GDP growth percentage', type: 'float' },
    { name: 'Inflation', description: 'Annual inflation rate percentage', type: 'float' },
    { name: 'UnemploymentRate', description: 'Unemployment rate percentage', type: 'float' },
    { name: 'TradeBalance', description: 'Trade balance in USD', type: 'float' },
    { name: 'Population', description: 'Total population', type: 'integer' }
  ]
};

// Related datasets
const relatedDatasets = [
  {
    id: '2',
    title: 'Trade Patterns & Exports',
    description: 'Analysis of trade patterns, export volumes, and international trade relationships.',
    category: 'Economics',
    format: 'CSV',
    country: 'Africa',
    date: 'Updated May 2023',
    downloads: 2548
  },
  {
    id: '3',
    title: 'Inflation Rates Time Series',
    description: 'Historical data on inflation rates across different regions over time.',
    category: 'Economics',
    format: 'JSON',
    country: 'Global',
    date: 'Updated April 2023',
    downloads: 1987
  },
  {
    id: '4',
    title: 'Economic Development Indicators',
    description: 'Indicators of economic development including infrastructure and investment metrics.',
    category: 'Economics',
    format: 'CSV',
    country: 'Africa',
    date: 'Updated March 2023',
    downloads: 1735
  }
];

// Visualization data
const sampleVisData = [
  { name: 'East Africa', value: 32.5 },
  { name: 'West Africa', value: 27.8 },
  { name: 'North Africa', value: 21.3 },
  { name: 'Southern Africa', value: 18.4 }
];

const DatasetDetail = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate API call
    const timer = setTimeout(() => {
      setDataset(sampleDataset);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container px-4 mx-auto py-12">
            <div className="glass border border-border/50 rounded-xl p-8 animate-pulse">
              <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-6 bg-muted rounded-full w-20"></div>
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-24"></div>
              </div>
              
              <div className="h-10 bg-muted rounded w-full mb-6"></div>
              <div className="h-64 bg-muted rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 mx-auto py-12">
          {/* Back Link */}
          <div className="mb-6">
            <Link to="/datasets" className="text-sm flex items-center text-foreground/70 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all datasets
            </Link>
          </div>
          
          {/* Dataset Header */}
          <div className="glass border border-border/50 rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {dataset.category}
                  </span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {dataset.format}
                  </span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {dataset.country}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-medium mb-2">{dataset.title}</h1>
                <p className="text-foreground/70">{dataset.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 ml-4">
                <Button variant="outline" size="sm" className="rounded-lg flex items-center">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" className="rounded-lg flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-foreground/60 mb-1">Downloads</p>
                <p className="text-lg font-medium flex items-center">
                  <Download className="h-4 w-4 mr-1 text-primary" />
                  {dataset.downloads.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Views</p>
                <p className="text-lg font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-primary" />
                  {dataset.views.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Last Updated</p>
                <p className="text-lg font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                  {dataset.lastUpdated}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Publisher</p>
                <p className="text-lg font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1 text-primary" />
                  {dataset.publisher}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 animate-fade-in">
            <TabsList className="mb-6 glass w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-slide-up">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-4">About This Dataset</h2>
                    <p className="text-foreground/70 mb-4">
                      This comprehensive dataset provides economic indicators for various regions, offering valuable insights for researchers, policymakers, and analysts. The data covers GDP, inflation rates, unemployment statistics, and trade balances over a 13-year period.
                    </p>
                    <p className="text-foreground/70 mb-4">
                      The collection methodology follows international standards for economic data collection, ensuring consistency and comparability across regions and time periods. Data points are aggregated quarterly and verified against official government reports.
                    </p>
                    <p className="text-foreground/70">
                      Users can explore economic trends, perform comparative analysis, and identify patterns in regional economic development. This dataset is particularly valuable for understanding economic disparities and growth trajectories.
                    </p>
                  </div>
                  
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-4">Sample Visualization</h2>
                    <p className="text-foreground/70 mb-4">
                      Below is a sample visualization showing regional economic contribution percentages based on the dataset:
                    </p>
                    <Visualization 
                      data={sampleVisData} 
                      title="Regional Economic Contribution" 
                      description="Percentage contribution to overall GDP by region"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-4">Dataset Details</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">License</p>
                        <p className="font-medium">{dataset.license}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Format</p>
                        <p className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-primary" />
                          {dataset.format}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">File Size</p>
                        <p className="font-medium">{dataset.fileSize}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Data Points</p>
                        <p className="font-medium">{dataset.dataPoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Time Period</p>
                        <p className="font-medium">{dataset.timespan}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Source</p>
                        <a 
                          href={dataset.source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline flex items-center"
                        >
                          Visit Original Source
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass border border-border/50 rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {dataset.tags.map((tag: string) => (
                        <Link 
                          key={tag} 
                          to={`/datasets?tag=${tag}`}
                          className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-secondary/80 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="animate-slide-up">
              <div className="glass border border-border/50 rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">Data Fields</h2>
                <p className="text-foreground/70 mb-6">
                  This dataset contains the following data fields. Understanding these fields will help you work with and analyze the data effectively.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 border-b border-border text-sm font-medium">Field Name</th>
                        <th className="text-left p-3 border-b border-border text-sm font-medium">Description</th>
                        <th className="text-left p-3 border-b border-border text-sm font-medium">Data Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.dataFields.map((field: any, index: number) => (
                        <tr key={index} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 border-b border-border/50 text-sm font-medium">{field.name}</td>
                          <td className="p-3 border-b border-border/50 text-sm">{field.description}</td>
                          <td className="p-3 border-b border-border/50 text-sm">
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {field.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="glass border border-border/50 rounded-xl p-6">
                  <h2 className="text-xl font-medium mb-4">Data Collection Methodology</h2>
                  <p className="text-foreground/70 mb-3">
                    This dataset was compiled using standardized methodologies for economic data collection:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 text-foreground/70">
                    <li>Quarterly aggregation of official economic statistics</li>
                    <li>Verification against government and international organization reports</li>
                    <li>Data normalization to ensure consistency across regions</li>
                    <li>Quality control processes to identify and correct anomalies</li>
                    <li>Rigorous peer review by economic experts</li>
                  </ul>
                </div>
                
                <div className="glass border border-border/50 rounded-xl p-6">
                  <h2 className="text-xl font-medium mb-4">Data Quality and Limitations</h2>
                  <p className="text-foreground/70 mb-3">
                    While we strive for accuracy, users should be aware of the following considerations:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 text-foreground/70">
                    <li>Some regions may have incomplete data for certain time periods</li>
                    <li>Economic definitions may vary slightly between different countries</li>
                    <li>Data collection methodologies improved over time, with more recent data being more reliable</li>
                    <li>Inflation adjustments may be needed for long-term comparisons</li>
                    <li>Regional aggregations may mask important sub-regional variations</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="visualize" className="animate-slide-up">
              <div className="glass border border-border/50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Visualize This Dataset</h2>
                <p className="text-foreground/70 mb-6">
                  Explore the data through interactive visualizations. Select different views and parameters to discover insights.
                </p>
                
                <Visualization 
                  data={[
                    { name: 'East Africa', value: 8.2 },
                    { name: 'West Africa', value: 6.7 },
                    { name: 'North Africa', value: 4.5 },
                    { name: 'Southern Africa', value: 3.2 },
                    { name: 'Central Africa', value: 5.1 }
                  ]} 
                  title="GDP Growth by Region (2022)" 
                  description="Annual GDP growth percentage by region"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass border border-border/50 rounded-xl p-6">
                  <Visualization 
                    data={[
                      { name: '2017', value: 3.2 },
                      { name: '2018', value: 3.8 },
                      { name: '2019', value: 4.1 },
                      { name: '2020', value: -1.8 },
                      { name: '2021', value: 4.5 },
                      { name: '2022', value: 5.6 },
                      { name: '2023', value: 4.9 }
                    ]} 
                    title="GDP Growth Trend (2017-2023)" 
                    description="Annual GDP growth percentage over time"
                  />
                </div>
                
                <div className="glass border border-border/50 rounded-xl p-6">
                  <Visualization 
                    data={[
                      { name: 'East Africa', value: 6.8 },
                      { name: 'West Africa', value: 9.2 },
                      { name: 'North Africa', value: 7.5 },
                      { name: 'Southern Africa', value: 5.3 },
                      { name: 'Central Africa', value: 8.1 }
                    ]} 
                    title="Inflation Rates by Region (2022)" 
                    description="Annual inflation percentage by region"
                  />
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-muted/30 rounded-xl">
                <h3 className="text-lg font-medium mb-3">Visualization Notes</h3>
                <p className="text-foreground/70">
                  These visualizations are generated using the dataset and are for illustration purposes. For more advanced visualizations or to create custom charts, download the dataset and use your preferred data analysis tools. You can also access our API to integrate this data into your own applications.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="animate-slide-up">
              <div className="glass border border-border/50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">API Access</h2>
                <p className="text-foreground/70 mb-6">
                  Integrate this dataset directly into your applications using our RESTful API. Below are examples of how to access this specific dataset programmatically.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">API Endpoint</h3>
                  <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
                    <code className="text-sm font-mono">https://api.opendata.org/v1/datasets/{dataset.id}</code>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Example Request (JavaScript)</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
{`fetch('https://api.opendata.org/v1/datasets/${dataset.id}')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error(error));`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Example Request (Python)</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
{`import requests

response = requests.get('https://api.opendata.org/v1/datasets/${dataset.id}')
data = response.json()
print(data)`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass border border-border/50 rounded-xl p-6">
                  <h2 className="text-xl font-medium mb-4">API Parameters</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Filtering</h3>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?region=east-africa</code> - Filter by region
                      </p>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?year=2022</code> - Filter by year
                      </p>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?metric=gdp</code> - Filter by metric
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Pagination</h3>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?limit=100</code> - Number of results
                      </p>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?offset=200</code> - Pagination offset
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Sorting</h3>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?sort=year</code> - Sort by field
                      </p>
                      <p className="text-sm text-foreground/70">
                        <code className="bg-muted px-1 py-0.5 rounded">?order=desc</code> - Sort direction
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="glass border border-border/50 rounded-xl p-6">
                  <h2 className="text-xl font-medium mb-4">API Authentication</h2>
                  <p className="text-foreground/70 mb-4">
                    Authentication is required for higher rate limits and access to premium features.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">API Key Authentication</h3>
                      <p className="text-sm text-foreground/70">
                        Add your API key to the request header:
                      </p>
                      <pre className="bg-muted px-3 py-2 mt-2 rounded text-xs font-mono">
                        Authorization: ApiKey YOUR_API_KEY
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Rate Limits</h3>
                      <p className="text-sm text-foreground/70">
                        Anonymous: 60 requests/hour<br />
                        Authenticated: 1,000 requests/hour<br />
                        Premium: 10,000 requests/hour
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button size="sm" className="w-full rounded-lg">
                      Get API Key
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/api" className="text-primary hover:underline flex items-center">
                  View Complete API Documentation
                  <ArrowLeft className="h-4 w-4 ml-1 transform rotate-180" />
                </Link>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Related Datasets */}
          <div className="mt-12 animate-fade-in">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-medium">Related Datasets</h2>
              <Link to="/datasets?category=economics" className="text-primary hover:underline text-sm">
                View More
              </Link>
            </div>
            
            <DatasetGrid 
              datasets={relatedDatasets} 
              columns={3}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DatasetDetail;
