
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDatasetById, getDatasetVisualization, downloadDataset } from '@/services';
import { Dataset } from '@/types/dataset';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { Loading } from '@/components/ui/loading';

// Import our components
import DatasetHeader from './DatasetHeader';
import DatasetOverview from './DatasetOverview';
import DatasetMetadata from './DatasetMetadata';
import DatasetVisualize from './DatasetVisualize';
import DatasetApiAccess from './DatasetApiAccess';
import RelatedDatasets from './RelatedDatasets';
import { LoadingState, NotFoundState } from './LoadingState';

const DatasetDetail = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [visData, setVisData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchDataset = async () => {
      if (!id) {
        setError("Missing dataset ID");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const data = await getDatasetById(id);
        if (data) {
          setDataset(data);
          
          const visualizationData = await getDatasetVisualization(id);
          setVisData(visualizationData);
        } else {
          setError("Dataset not found");
        }
      } catch (err) {
        console.error("Error fetching dataset:", err);
        setError("Failed to load dataset");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDataset();
  }, [id]);
  
  const handleDownload = async () => {
    if (!id) return;
    await downloadDataset(id);
  };

  // Handle tab change with history state
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without full page reload
    window.history.pushState(
      { tab: value },
      '',
      `${window.location.pathname}?tab=${value}`
    );
  };
  
  // Sync with URL parameters when page loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'metadata', 'visualize', 'api'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 mx-auto py-12">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="glass border border-border/50 rounded-xl p-8">
              <h1 className="text-2xl md:text-3xl font-medium mb-4">Error Loading Dataset</h1>
              <p className="text-foreground/70 mb-6">
                {error}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = '/datasets'}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Back to Datasets
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !dataset ? (
            <NotFoundState />
          ) : (
            <>
              <DatasetHeader 
                dataset={dataset} 
                handleDownload={handleDownload} 
              />
              
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8 animate-fade-in">
                <TabsList className="mb-6 glass w-full justify-start">
                  <TabsTrigger value="overview" aria-controls="overview-tab">Overview</TabsTrigger>
                  <TabsTrigger value="metadata" aria-controls="metadata-tab">Metadata</TabsTrigger>
                  <TabsTrigger id="visualize-tab" value="visualize" aria-controls="visualize-tab">Visualize</TabsTrigger>
                  <TabsTrigger value="api" aria-controls="api-tab">API Access</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" id="overview-tab" role="tabpanel" className="animate-slide-up">
                  <ErrorBoundaryWrapper componentName="Dataset Overview">
                    <DatasetOverview dataset={dataset} />
                  </ErrorBoundaryWrapper>
                </TabsContent>
                
                <TabsContent value="metadata" id="metadata-tab" role="tabpanel" className="animate-slide-up">
                  <ErrorBoundaryWrapper componentName="Dataset Metadata">
                    <DatasetMetadata dataset={dataset} />
                  </ErrorBoundaryWrapper>
                </TabsContent>
                
                <TabsContent value="visualize" id="visualize-tab" role="tabpanel" className="animate-slide-up">
                  <ErrorBoundaryWrapper componentName="Dataset Visualization">
                    <DatasetVisualize datasetProp={dataset} visualizationDataProp={visData} />
                  </ErrorBoundaryWrapper>
                </TabsContent>
                
                <TabsContent value="api" id="api-tab" role="tabpanel" className="animate-slide-up">
                  <ErrorBoundaryWrapper componentName="API Access">
                    <DatasetApiAccess dataset={dataset} />
                  </ErrorBoundaryWrapper>
                </TabsContent>
              </Tabs>
              
              <ErrorBoundaryWrapper componentName="Related Datasets">
                <RelatedDatasets category={dataset.category} />
              </ErrorBoundaryWrapper>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DatasetDetail;
