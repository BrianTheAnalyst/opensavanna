
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Entity, EntityType, EntityRelationship } from "@/types/entity";

// Get entities with optional filtering
export const getEntities = async (
  type?: EntityType, 
  search?: string
): Promise<Entity[]> => {
  try {
    let query = supabase.from('entities').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching entities:', error);
      toast.error('Failed to load entities');
      return [];
    }
    
    return data as Entity[];
  } catch (error) {
    console.error('Error in getEntities:', error);
    toast.error('Failed to load entities');
    return [];
  }
};

// Get a single entity by ID
export const getEntityById = async (id: string): Promise<Entity | null> => {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching entity:', error);
      toast.error('Failed to load entity');
      return null;
    }
    
    return data as Entity;
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
    let query = supabase
      .from('entity_relationships')
      .select('*')
      .or(`sourceEntityId.eq.${entityId},targetEntityId.eq.${entityId}`);
    
    if (relationshipType) {
      query = query.eq('type', relationshipType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching entity relationships:', error);
      toast.error('Failed to load relationships');
      return [];
    }
    
    return data as EntityRelationship[];
  } catch (error) {
    console.error('Error in getEntityRelationships:', error);
    toast.error('Failed to load relationships');
    return [];
  }
};

// Get datasets related to an entity
export const getDatasetsByEntity = async (entityId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('dataset_entity_mappings')
      .select('dataset_id')
      .eq('entity_id', entityId);
    
    if (error) {
      console.error('Error fetching datasets by entity:', error);
      toast.error('Failed to load related datasets');
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const datasetIds = data.map(mapping => mapping.dataset_id);
    
    const { data: datasets, error: datasetsError } = await supabase
      .from('datasets')
      .select('*')
      .in('id', datasetIds);
      
    if (datasetsError) {
      console.error('Error fetching datasets:', datasetsError);
      toast.error('Failed to load related datasets');
      return [];
    }
    
    return datasets;
  } catch (error) {
    console.error('Error in getDatasetsByEntity:', error);
    toast.error('Failed to load related datasets');
    return [];
  }
};

// Link a dataset to an entity
export const linkDatasetToEntity = async (
  datasetId: string,
  entityId: string,
  relationshipType: string = 'related_to',
  relevance: number = 1
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('dataset_entity_mappings')
      .insert({
        dataset_id: datasetId,
        entity_id: entityId,
        relationship_type: relationshipType,
        relevance: relevance
      });
    
    if (error) {
      console.error('Error linking dataset to entity:', error);
      toast.error('Failed to link dataset to entity');
      return false;
    }
    
    toast.success('Dataset linked to entity successfully');
    return true;
  } catch (error) {
    console.error('Error in linkDatasetToEntity:', error);
    toast.error('Failed to link dataset to entity');
    return false;
  }
};
