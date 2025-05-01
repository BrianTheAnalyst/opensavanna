
import { toast } from "sonner";
import { Entity, EntityType, EntityRelationship } from "@/types/entity";

// Mock data - replace with actual database implementation once tables are created
const mockEntities: Entity[] = [
  {
    id: '1',
    name: 'San Francisco',
    type: 'Place',
    description: 'Major city in California, United States',
    aliases: ['SF', 'San Fran'],
    properties: {
      population: 873965,
      region: 'West Coast'
    }
  },
  {
    id: '2',
    name: 'Climate Change',
    type: 'Topic',
    description: 'Long-term change in temperature and weather patterns',
  },
  {
    id: '3',
    name: 'World Health Organization',
    type: 'Organization',
    description: 'Specialized agency of the United Nations responsible for international public health',
    aliases: ['WHO'],
  },
  {
    id: '4',
    name: 'COVID-19 Pandemic',
    type: 'Event',
    description: 'Global pandemic caused by SARS-CoV-2',
  },
  {
    id: '5',
    name: 'Jane Doe',
    type: 'Person',
    description: 'Environmental researcher focused on climate impacts',
  }
];

const mockRelationships: EntityRelationship[] = [
  {
    id: '101',
    sourceEntityId: '2',
    targetEntityId: '1',
    type: 'impacts',
  },
  {
    id: '102',
    sourceEntityId: '3',
    targetEntityId: '4',
    type: 'manages',
  },
  {
    id: '103',
    sourceEntityId: '5',
    targetEntityId: '2',
    type: 'studies',
  },
  {
    id: '104',
    sourceEntityId: '1',
    targetEntityId: '4',
    type: 'affected_by',
  }
];

// Get entities with optional filtering
export const getEntities = async (
  type?: EntityType, 
  search?: string
): Promise<Entity[]> => {
  try {
    // Filter mock data based on parameters
    let result = [...mockEntities];
    
    if (type) {
      result = result.filter(entity => entity.type === type);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(entity => 
        entity.name.toLowerCase().includes(searchLower) || 
        entity.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  } catch (error) {
    console.error('Error in getEntities:', error);
    toast.error('Failed to load entities');
    return [];
  }
};

// Get a single entity by ID
export const getEntityById = async (id: string): Promise<Entity | null> => {
  try {
    const entity = mockEntities.find(e => e.id === id);
    
    if (!entity) {
      toast.error('Entity not found');
      return null;
    }
    
    return entity;
  } catch (error) {
    console.error('Error in getEntityById:', error);
    toast.error('Failed to load entity');
    return null;
  }
};

// Get entity relationships
export const getEntityRelationships = async (
  entityId: string, 
  relationshipType?: string
): Promise<EntityRelationship[]> => {
  try {
    let result = mockRelationships.filter(rel => 
      rel.sourceEntityId === entityId || rel.targetEntityId === entityId
    );
    
    if (relationshipType) {
      result = result.filter(rel => rel.type === relationshipType);
    }
    
    return result;
  } catch (error) {
    console.error('Error in getEntityRelationships:', error);
    toast.error('Failed to load relationships');
    return [];
  }
};

// Get datasets related to an entity - still uses Supabase since datasets table exists
export const getDatasetsByEntity = async (entityId: string): Promise<any[]> => {
  try {
    // For now, return mock data since we don't have the mapping table yet
    return [];
  } catch (error) {
    console.error('Error in getDatasetsByEntity:', error);
    toast.error('Failed to load related datasets');
    return [];
  }
};

// Link a dataset to an entity - still uses Supabase since datasets table exists
export const linkDatasetToEntity = async (
  datasetId: string,
  entityId: string,
  relationshipType: string = 'related_to',
  relevance: number = 1
): Promise<boolean> => {
  try {
    // For now, just simulate success
    toast.success('Dataset linked to entity successfully');
    return true;
  } catch (error) {
    console.error('Error in linkDatasetToEntity:', error);
    toast.error('Failed to link dataset to entity');
    return false;
  }
};
