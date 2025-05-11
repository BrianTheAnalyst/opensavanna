
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDatasetById, getDatasetVisualization, downloadDataset } from '@/services';
import { Dataset } from '@/types/dataset';

// Import our newly created components
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
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchDataset = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const data = await getDatasetById(id);
      if (data) {
        setDataset(data);
        
        const visualizationData = await getDatasetVisualization(id);
        setVisData(visualizationData);
      }
      setIsLoading(false);
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
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger id="visualize-tab" value="visualize">Visualize</TabsTrigger>
                  <TabsTrigger value="api">API Access</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="animate-slide-up">
                  <DatasetOverview dataset={dataset} />
                </TabsContent>
                
                <TabsContent value="metadata" className="animate-slide-up">
                  <DatasetMetadata dataset={dataset} />
                </TabsContent>
                
                <TabsContent value="visualize" className="animate-slide-up">
                  <DatasetVisualize datasetProp={dataset} visualizationDataProp={visData} />
                </TabsContent>
                
                <TabsContent value="api" className="animate-slide-up">
                  <DatasetApiAccess dataset={dataset} />
                </TabsContent>
              </Tabs>
              
              <RelatedDatasets category={dataset.category} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DatasetDetail;
