import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { isUserAdmin } from '@/services/userRoleService';
import { Dataset } from '@/types/dataset';
import DatasetVerificationCard from '@/components/admin/DatasetVerificationCard';
import DatasetReviewDialog from '@/components/admin/DatasetReviewDialog';
import EmptyDatasetState from '@/components/admin/EmptyDatasetState';

interface DatasetWithEmail extends Dataset {
  email?: string;
  users?: { email: string } | null;
}

// Define a base type for raw data from Supabase
interface SupabaseDatasetItem {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number | null;
  featured?: boolean;
  file?: string;
  source?: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  users: { email: string } | null;
}

const DatasetVerificationPage = () => {
  const [datasets, setDatasets] = useState<DatasetWithEmail[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetWithEmail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  // Load datasets based on verification status
  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      // Check if user is admin
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        toast.error('You do not have permission to access this page');
        navigate('/');
        return;
      }
      
      await loadDatasets();
    };
    
    checkAdminAndLoadData();
  }, [navigate, activeTab]);
  
  // Load datasets based on active tab
  const loadDatasets = async () => {
    setIsLoading(true);
    try {
      // Query datasets with verification status matching the active tab
      const { data, error } = await supabase
        .from('datasets')
        .select('*, users:user_id(email)')
        .eq('verificationStatus', activeTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // First cast to unknown to avoid type instantiation depth issues
      const rawItems = data as unknown as SupabaseDatasetItem[];
      
      // Then map the items to our expected DatasetWithEmail type
      const formattedData: DatasetWithEmail[] = (rawItems || []).map(item => ({
        ...item,
        email: item.users?.email || 'Unknown',
        verificationStatus: item.verificationStatus || 'pending',
        downloads: item.downloads || 0
      }));
      
      setDatasets(formattedData);
    } catch (error) {
      console.error('Error loading datasets:', error);
      toast.error('Failed to load datasets');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle dataset processed event
  const handleDatasetProcessed = (datasetId: string) => {
    setDatasets(datasets.filter(d => d.id !== datasetId));
    setSelectedDataset(null);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
      <p className="text-foreground/70">Loading datasets...</p>
    </div>
  );
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 mx-auto py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-medium mb-2">Dataset Verification</h1>
            <p className="text-foreground/70 mb-6">
              Review and verify submitted datasets before they are published to the African Data Commons
            </p>
            
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <LoadingSpinner />
            ) : datasets.length === 0 ? (
              <EmptyDatasetState activeTab={activeTab} />
            ) : (
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <DatasetVerificationCard 
                    key={dataset.id} 
                    dataset={dataset} 
                    onReview={setSelectedDataset} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Dataset Review Dialog */}
      <DatasetReviewDialog
        dataset={selectedDataset}
        onClose={() => setSelectedDataset(null)}
        onProcessed={handleDatasetProcessed}
      />
    </div>
  );
};

export default DatasetVerificationPage;
