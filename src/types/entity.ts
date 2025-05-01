
// Entity types for the data commons model
export type EntityType = 'Place' | 'Organization' | 'Topic' | 'Event' | 'Person' | 'Concept';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description?: string;
  properties?: Record<string, any>;
  metadata?: Record<string, any>;
  parentId?: string; // For hierarchical relationships
  aliases?: string[]; // Alternative names
  externalIds?: Record<string, string>; // IDs in external systems
  created_at?: string;
  updated_at?: string;
}

export interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: string; // e.g., "contains", "part_of", "related_to", etc.
  weight?: number; // For weighted relationships
  properties?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Extended Dataset type with entity relationships
export interface EnhancedDataset extends Dataset {
  entities?: {
    entityId: string;
    relationshipType: string;
    relevance?: number;
  }[];
}

// Import the base Dataset type
import { Dataset } from './dataset';
