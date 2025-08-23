
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDatasetById, getDatasetVisualization, downloadDataset } from '@/services';
import { Dataset } from '@/types/dataset';

// Import our newly created components
import DatasetApiAccess from './DatasetApiAccess';
import DatasetHeader from './DatasetHeader';
import DatasetMetadata from './DatasetMetadata';
import DatasetOverview from './DatasetOverview';
import DatasetVisualize from './DatasetVisualize';
import { LoadingState, NotFoundState } from './LoadingState';
import RelatedDatasets from './RelatedDatasets';


const DatasetDetail = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [visData, setVisData] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const fetchDataset = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await getDatasetById(id);
      if (data) {
        setDataset(data);
        
        const visualizationData = await getDatasetVisualization(id);
        setVisData(visualizationData);
      } else {
        // Dataset not found - might have been deleted
        toast.error("Dataset not found. It may have been deleted.");
        navigate('/datasets', { replace: true });
      }
    } catch (error) {
      console.error("Error fetching dataset:", error);
      toast.error("Failed to load dataset details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
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
  
  // Handle data change (e.g., after deletion)
  const handleDataChange = () => {
    console.log("Data change detected in dataset detail page");
    fetchDataset();
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
                onDataChange={handleDataChange}
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
              
              <RelatedDatasets category={dataset.category} onDataChange={handleDataChange} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DatasetDetail;
