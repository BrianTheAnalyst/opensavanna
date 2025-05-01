
import React, { useState, useEffect, useRef } from 'react';
import { Entity, EntityRelationship } from '@/types/entity';
import { getEntityRelationships, getEntityById } from '@/services/entityService';
import { Loader2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GraphNode {
  id: string;
  name: string;
  type: string;
  level: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

interface KnowledgeGraphProps {
  rootEntity: Entity;
  depth?: number;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  rootEntity, 
  depth = 2
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const graphRef = useRef<HTMLDivElement>(null);
  
  // Load entity relationships
  useEffect(() => {
    const fetchRelationships = async () => {
      setIsLoading(true);
      
      try {
        const rootNode: GraphNode = {
          id: rootEntity.id,
          name: rootEntity.name,
          type: rootEntity.type,
          level: 0
        };
        
        const graphNodes: GraphNode[] = [rootNode];
        const graphLinks: GraphLink[] = [];
        const processedNodes = new Set<string>([rootEntity.id]);
        
        // Recursive function to fetch relationships up to a certain depth
        const fetchRelatedEntities = async (entityId: string, currentDepth: number) => {
          if (currentDepth >= depth) return;
          
          const relationships = await getEntityRelationships(entityId);
          
          for (const relationship of relationships) {
            const relatedEntityId = relationship.sourceEntityId === entityId 
              ? relationship.targetEntityId 
              : relationship.sourceEntityId;
            
            if (!processedNodes.has(relatedEntityId)) {
              // Fetch the entity data
              const entityData = await getEntityById(relatedEntityId);
              
              if (entityData) {
                const relatedNode: GraphNode = {
                  id: relatedEntityId,
                  name: entityData.name,
                  type: entityData.type,
                  level: currentDepth + 1
                };
                
                graphNodes.push(relatedNode);
                processedNodes.add(relatedEntityId);
                
                // Add the link
                graphLinks.push({
                  source: relationship.sourceEntityId,
                  target: relationship.targetEntityId,
                  type: relationship.type
                });
                
                // Recursively fetch relationships for this entity
                await fetchRelatedEntities(relatedEntityId, currentDepth + 1);
              }
            } else {
              // If we've seen this node before, just add the link
              graphLinks.push({
                source: relationship.sourceEntityId,
                target: relationship.targetEntityId,
                type: relationship.type
              });
            }
          }
        };
        
        await fetchRelatedEntities(rootEntity.id, 0);
        
        setNodes(graphNodes);
        setLinks(graphLinks);
      } catch (error) {
        console.error('Error fetching graph data:', error);
        toast.error('Failed to load knowledge graph');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelationships();
  }, [rootEntity, depth]);
  
  // Simple force-directed layout simulation would go here in a real implementation
  // For now, we'll just render a placeholder
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleRefresh = () => {
    // Re-run the layout algorithm
    toast.info('Refreshing graph layout');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80 border border-border/50 rounded-xl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p>Loading knowledge graph...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass border border-border/50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Knowledge Graph</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={graphRef}
        className="relative h-80 bg-muted/20 rounded-lg overflow-hidden"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {nodes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No relationships found for this entity</p>
          </div>
        ) : (
          <div className="absolute inset-0 p-4">
            {/* This is a placeholder. In a real implementation, we would use a library like D3.js or react-force-graph */}
            <div className="flex flex-col items-center justify-center h-full">
              <p>Knowledge graph with {nodes.length} entities and {links.length} relationships</p>
              <p className="text-sm text-muted-foreground mt-2">Centered on: {rootEntity.name}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Connected Entities ({nodes.length})</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {nodes.slice(0, 8).map((node) => (
            <div 
              key={node.id} 
              className="text-xs px-3 py-1.5 bg-background border border-border rounded-lg flex items-center"
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${
                node.type === 'Place' ? 'bg-green-500' : 
                node.type === 'Organization' ? 'bg-blue-500' : 
                node.type === 'Topic' ? 'bg-purple-500' : 
                node.type === 'Event' ? 'bg-yellow-500' : 
                node.type === 'Person' ? 'bg-red-500' : 
                'bg-gray-500'
              }`}></span>
              {node.name}
            </div>
          ))}
          {nodes.length > 8 && (
            <div className="text-xs px-3 py-1.5 bg-background border border-border rounded-lg">
              +{nodes.length - 8} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
