
import { toast } from "sonner";
import { Entity, EntityType, EntityRelationship } from "@/types/entity";
import { supabase } from "@/integrations/supabase/client";

// Get entities with optional filtering
export const getEntities = async (
  type?: EntityType, 
  search?: string
): Promise<Entity[]> => {
  try {
    // Create base query
    let query = supabase
      .from('entities')
      .select('*');
    
    // Apply filters if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Execute query
    const { data, error } = await query;
    
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
      .single();
    
    if (error) {
      console.error('Error fetching entity by id:', error);
      toast.error('Entity not found');
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
    // We need to fetch relationships where the entity is either the source or the target
    // First, get relationships where entity is the source
    let querySource = supabase
      .from('entity_relationships')
      .select('*')
      .eq('source_entity_id', entityId);
    
    // Add relationship type filter if provided
    if (relationshipType) {
      querySource = querySource.eq('type', relationshipType);
    }
    
    const { data: sourceRelationships, error: sourceError } = await querySource;
    
    if (sourceError) {
      console.error('Error fetching source relationships:', sourceError);
      return [];
    }
    
    // Then, get relationships where entity is the target
    let queryTarget = supabase
      .from('entity_relationships')
      .select('*')
      .eq('target_entity_id', entityId);
    
    // Add relationship type filter if provided
    if (relationshipType) {
      queryTarget = queryTarget.eq('type', relationshipType);
    }
    
    const { data: targetRelationships, error: targetError } = await queryTarget;
    
    if (targetError) {
      console.error('Error fetching target relationships:', targetError);
      return [];
    }
    
    // Combine and format the relationships
    const relationships = [...(sourceRelationships || []), ...(targetRelationships || [])].map(rel => ({
      id: rel.id,
      sourceEntityId: rel.source_entity_id,
      targetEntityId: rel.target_entity_id,
      type: rel.type,
      weight: rel.weight,
      properties: rel.properties,
      metadata: rel.metadata,
      created_at: rel.created_at,
      updated_at: rel.updated_at
    }));
    
    return relationships as EntityRelationship[];
  } catch (error) {
    console.error('Error in getEntityRelationships:', error);
    toast.error('Failed to load relationships');
    return [];
  }
};

// Get datasets related to an entity - uses the dataset_entity_relationships table
export const getDatasetsByEntity = async (entityId: string): Promise<any[]> => {
  try {
    // Join the dataset_entity_relationships table with the datasets table
    const { data, error } = await supabase
      .from('dataset_entity_relationships')
      .select(`
        relevance,
        relationship_type,
        datasets:dataset_id (*)
      `)
      .eq('entity_id', entityId);
    
    if (error) {
      console.error('Error fetching related datasets:', error);
      toast.error('Failed to load related datasets');
      return [];
    }
    
    // Transform the data to get the datasets with relationship info
    const datasets = data?.map(item => ({
      ...item.datasets,
      relationshipType: item.relationship_type,
      relevance: item.relevance
    })) || [];
    
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
    // Get the user ID first and then use it in the insert
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    const { error } = await supabase
      .from('dataset_entity_relationships')
      .insert({
        dataset_id: datasetId,
        entity_id: entityId,
        relationship_type: relationshipType,
        relevance: relevance,
        created_by: userId
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

// Create a new entity
export const createEntity = async (entity: Omit<Entity, 'id' | 'created_at' | 'updated_at'>): Promise<Entity | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    // Fix: Ensure properties and metadata are properly typed as Record<string, any> or null
    const entityData = {
      ...entity,
      // Convert properties and metadata to ensure they're properly typed
      properties: entity.properties || null,
      metadata: entity.metadata || null,
      created_by: user.user?.id
    };
    
    const { data, error } = await supabase
      .from('entities')
      .insert(entityData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating entity:', error);
      toast.error('Failed to create entity');
      return null;
    }
    
    toast.success('Entity created successfully');
    return data as Entity;
  } catch (error) {
    console.error('Error in createEntity:', error);
    toast.error('Failed to create entity');
    return null;
  }
};

// Create a new relationship between entities
export const createEntityRelationship = async (
  sourceEntityId: string,
  targetEntityId: string,
  type: string,
  properties?: Record<string, any>
): Promise<EntityRelationship | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('entity_relationships')
      .insert({
        source_entity_id: sourceEntityId,
        target_entity_id: targetEntityId,
        type,
        properties: properties || null,
        created_by: user.user?.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating relationship:', error);
      toast.error('Failed to create relationship');
      return null;
    }
    
    toast.success('Relationship created successfully');
    
    // Fix: Properly handle the JSON data types by checking their type before assigning
    const properties_data = typeof data.properties === 'object' && data.properties !== null 
      ? data.properties as Record<string, any> 
      : {};
      
    const metadata_data = typeof data.metadata === 'object' && data.metadata !== null 
      ? data.metadata as Record<string, any> 
      : {};
    
    return {
      id: data.id,
      sourceEntityId: data.source_entity_id,
      targetEntityId: data.target_entity_id,
      type: data.type,
      weight: data.weight,
      properties: properties_data,
      metadata: metadata_data,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error in createEntityRelationship:', error);
    toast.error('Failed to create relationship');
    return null;
  }
};
