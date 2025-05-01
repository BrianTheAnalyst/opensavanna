
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isUserAdmin } from '@/services/userRoleService';
import { Dataset } from '@/types/dataset';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DatasetWithVerification = Dataset & {
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  source?: string;
  email?: string; // Submitter email
};

const DatasetVerificationPage = () => {
  const [datasets, setDatasets] = useState<DatasetWithVerification[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetWithVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  // Load datasets pending verification
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
      
      // Format datasets with user email
      const formattedData = data.map(item => ({
        ...item,
        email: item.users ? item.users.email : 'Unknown'
      })) as DatasetWithVerification[];
      
      setDatasets(formattedData);
    } catch (error) {
      console.error('Error loading datasets:', error);
      toast.error('Failed to load datasets');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open dataset for review
  const openDatasetReview = (dataset: DatasetWithVerification) => {
    setSelectedDataset(dataset);
    setFeedbackNote('');
  };
  
  // Close dataset review dialog
  const closeDatasetReview = () => {
    setSelectedDataset(null);
  };
  
  // Process verification
  const processVerification = async (action: 'approve' | 'reject') => {
    if (!selectedDataset) return;
    
    setIsProcessing(true);
    
    try {
      // Update dataset verification status
      const { error } = await supabase
        .from('datasets')
        .update({
          verificationStatus: action === 'approve' ? 'approved' : 'rejected',
          verified: action === 'approve',
          verificationNotes: feedbackNote || null,
          verifiedAt: action === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', selectedDataset.id);
      
      if (error) throw error;
      
      toast.success(`Dataset ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Update local state by removing the processed dataset
      setDatasets(datasets.filter(d => d.id !== selectedDataset.id));
      closeDatasetReview();
      
      // Send notification to the user (in a real app this would trigger an email)
      // This is a placeholder for future email notification functionality
      console.log(`Notification would be sent to ${selectedDataset.email} about dataset ${action}`);
      
    } catch (error) {
      console.error(`Error ${action}ing dataset:`, error);
      toast.error(`Failed to ${action} dataset`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Preview data component
  const DataPreview = ({ dataset }: { dataset: DatasetWithVerification }) => {
    const [preview, setPreview] = useState<string>('Loading preview...');
    
    useEffect(() => {
      const loadPreview = async () => {
        if (dataset.file) {
          try {
            const response = await fetch(dataset.file);
            const text = await response.text();
            // Show first 500 chars as preview
            setPreview(text.slice(0, 500) + (text.length > 500 ? '...' : ''));
          } catch (error) {
            setPreview('Unable to load file preview');
          }
        } else {
          setPreview('No file available');
        }
      };
      
      loadPreview();
    }, [dataset.file]);
    
    return (
      <div className="border rounded-md p-3 bg-muted/30 overflow-x-auto">
        <pre className="text-xs font-mono whitespace-pre-wrap">{preview}</pre>
      </div>
    );
  };
  
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
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-foreground/70">Loading datasets...</p>
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-medium mb-1">No datasets {activeTab}</h3>
                <p className="text-foreground/70">
                  {activeTab === 'pending' 
                    ? 'There are no datasets pending verification at this time.' 
                    : `No datasets have been ${activeTab} yet.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <Card key={dataset.id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium">{dataset.title}</h3>
                          <StatusBadge status={dataset.verificationStatus} />
                        </div>
                        <p className="text-sm text-foreground/70 mt-1 mb-2">{dataset.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <span className="text-foreground/50">Category:</span> {dataset.category}
                          </div>
                          <div>
                            <span className="text-foreground/50">Format:</span> {dataset.format}
                          </div>
                          <div>
                            <span className="text-foreground/50">Country/Region:</span> {dataset.country}
                          </div>
                          <div>
                            <span className="text-foreground/50">Source:</span> {dataset.source || 'Not specified'}
                          </div>
                          <div>
                            <span className="text-foreground/50">Submitter:</span> {dataset.email}
                          </div>
                          <div>
                            <span className="text-foreground/50">Submitted:</span> {new Date(dataset.created_at || '').toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 justify-center items-start md:items-end">
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => openDatasetReview(dataset)}
                        >
                          Review Dataset
                        </Button>
                        
                        {dataset.file && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => window.open(dataset.file, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View File
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Dataset Review Dialog */}
      <Dialog open={!!selectedDataset} onOpenChange={open => !open && closeDatasetReview()}>
        <DialogContent className="max-w-3xl">
          {selectedDataset && (
            <>
              <DialogHeader>
                <DialogTitle>Review Dataset: {selectedDataset.title}</DialogTitle>
                <DialogDescription>
                  Verify this dataset complies with African data protection laws and quality standards
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Dataset Details</h4>
                  <div className="glass border border-border/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-foreground/50">Description</p>
                        <p className="text-sm">{selectedDataset.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/50">Source</p>
                        <p className="text-sm">{selectedDataset.source || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Data Preview</h4>
                  <DataPreview dataset={selectedDataset} />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Verification Notes</h4>
                  <Textarea 
                    placeholder="Add notes about this dataset (compliance, quality, follow-up needed, etc.)"
                    value={feedbackNote}
                    onChange={e => setFeedbackNote(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Verify this dataset meets quality standards and complies with African data protection laws before approval.
                  </AlertDescription>
                </Alert>
              </div>
              
              <Separator />
              
              <DialogFooter>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={closeDatasetReview}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={() => processVerification('reject')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Reject Dataset'}
                    </Button>
                    
                    <Button 
                      variant="default"
                      onClick={() => processVerification('approve')} 
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Approve Dataset'}
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatasetVerificationPage;
