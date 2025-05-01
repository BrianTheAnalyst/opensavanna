
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Entity } from '@/types/entity';
import { getEntityById, getDatasetsByEntity } from '@/services/entityService';
import { Dataset } from '@/types/dataset';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatasetGrid from '@/components/DatasetGrid';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { Loader2, Globe, Building2, BookOpen, Calendar, User, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EntityDetail = () => {
  const { id } = useParams();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [relatedDatasets, setRelatedDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEntityData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const entityData = await getEntityById(id);
        
        if (entityData) {
          setEntity(entityData);
          
          // Fetch related datasets
          const datasets = await getDatasetsByEntity(id);
          setRelatedDatasets(datasets);
        }
      } catch (error) {
        console.error('Error fetching entity details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntityData();
  }, [id]);
  
  // Return the appropriate icon based on entity type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Place':
        return <Globe className="h-6 w-6" />;
      case 'Organization':
        return <Building2 className="h-6 w-6" />;
      case 'Topic':
        return <BookOpen className="h-6 w-6" />;
      case 'Event':
        return <Calendar className="h-6 w-6" />;
      case 'Person':
        return <User className="h-6 w-6" />;
      default:
        return <Tag className="h-6 w-6" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Loading entity data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!entity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container px-4 mx-auto py-12">
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-4">Entity Not Found</h1>
              <p className="mb-6">The entity you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
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
          {/* Entity Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                entity.type === 'Place' ? 'bg-green-500/10 text-green-500' : 
                entity.type === 'Organization' ? 'bg-blue-500/10 text-blue-500' : 
                entity.type === 'Topic' ? 'bg-purple-500/10 text-purple-500' : 
                entity.type === 'Event' ? 'bg-yellow-500/10 text-yellow-500' : 
                entity.type === 'Person' ? 'bg-red-500/10 text-red-500' : 
                'bg-gray-500/10 text-gray-500'
              }`}>
                {getEntityIcon(entity.type)}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{entity.type}</div>
                <h1 className="text-3xl font-medium">{entity.name}</h1>
              </div>
            </div>
            <p className="text-foreground/70 max-w-3xl">{entity.description}</p>
            
            {entity.aliases && entity.aliases.length > 0 && (
              <div className="mt-3 flex items-center text-sm text-muted-foreground">
                <span className="mr-2">Also known as:</span>
                <div className="flex flex-wrap gap-1">
                  {entity.aliases.map((alias, index) => (
                    <span key={index} className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-6 glass w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="datasets">Related Datasets</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-slide-up">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="glass border border-border/50 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-medium mb-4">About This Entity</h2>
                    <div className="prose prose-sm max-w-none text-foreground/80 space-y-4">
                      <p>{entity.description || `This is a ${entity.type.toLowerCase()} entity in the knowledge graph.`}</p>
                      
                      {entity.properties && Object.keys(entity.properties).length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium mb-2">Properties</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(entity.properties).map(([key, value]) => (
                              <div key={key} className="border-t border-border/30 pt-2">
                                <p className="text-xs text-foreground/60 mb-1">{key}</p>
                                <p className="font-medium">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Knowledge Graph Visualization */}
                  {entity && <KnowledgeGraph rootEntity={entity} />}
                </div>
                
                <div>
                  {/* Entity Info Sidebar */}
                  <div className="glass border border-border/50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Entity Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Entity Type</p>
                        <div className="flex items-center font-medium">
                          {getEntityIcon(entity.type)}
                          <span className="ml-2">{entity.type}</span>
                        </div>
                      </div>
                      
                      {entity.parentId && (
                        <div>
                          <p className="text-xs text-foreground/60 mb-1">Parent Entity</p>
                          <p className="font-medium">ID: {entity.parentId}</p>
                        </div>
                      )}
                      
                      {entity.externalIds && Object.keys(entity.externalIds).length > 0 && (
                        <div>
                          <p className="text-xs text-foreground/60 mb-1">External Identifiers</p>
                          <div className="space-y-1">
                            {Object.entries(entity.externalIds).map(([system, id]) => (
                              <div key={system} className="flex justify-between text-sm">
                                <span>{system}:</span>
                                <span className="font-mono">{id}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Related Datasets</p>
                        <p className="font-medium">{relatedDatasets.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="datasets" className="animate-slide-up">
              <div className="glass border border-border/50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Datasets Related to {entity.name}</h2>
                
                {relatedDatasets.length > 0 ? (
                  <DatasetGrid datasets={relatedDatasets} columns={3} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-foreground/70 mb-4">No datasets are currently linked to this entity.</p>
                    <Button>Add a Related Dataset</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="relationships" className="animate-slide-up">
              <div className="glass border border-border/50 rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">Entity Relationships</h2>
                
                <div className="h-[500px]">
                  {/* Show a larger, more detailed knowledge graph */}
                  {entity && <KnowledgeGraph rootEntity={entity} depth={3} />}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EntityDetail;
