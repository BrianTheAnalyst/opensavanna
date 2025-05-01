export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dataset_entity_relationships: {
        Row: {
          created_at: string
          created_by: string | null
          dataset_id: string
          entity_id: string
          id: string
          relationship_type: string
          relevance: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dataset_id: string
          entity_id: string
          id?: string
          relationship_type?: string
          relevance?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dataset_id?: string
          entity_id?: string
          id?: string
          relationship_type?: string
          relevance?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataset_entity_relationships_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dataset_entity_relationships_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          category: string
          country: string
          created_at: string | null
          date: string
          description: string
          downloads: number | null
          featured: boolean | null
          file: string | null
          format: string
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          country: string
          created_at?: string | null
          date: string
          description: string
          downloads?: number | null
          featured?: boolean | null
          file?: string | null
          format: string
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          country?: string
          created_at?: string | null
          date?: string
          description?: string
          downloads?: number | null
          featured?: boolean | null
          file?: string | null
          format?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      entities: {
        Row: {
          aliases: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          external_ids: Json | null
          id: string
          metadata: Json | null
          name: string
          parent_id: string | null
          properties: Json | null
          type: Database["public"]["Enums"]["entity_type"]
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          external_ids?: Json | null
          id?: string
          metadata?: Json | null
          name: string
          parent_id?: string | null
          properties?: Json | null
          type: Database["public"]["Enums"]["entity_type"]
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          external_ids?: Json | null
          id?: string
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          properties?: Json | null
          type?: Database["public"]["Enums"]["entity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entities_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_relationships: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          properties: Json | null
          source_entity_id: string
          target_entity_id: string
          type: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          properties?: Json | null
          source_entity_id: string
          target_entity_id: string
          type: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          properties?: Json | null
          source_entity_id?: string
          target_entity_id?: string
          type?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_files: {
        Row: {
          created_at: string
          errors: string[] | null
          file_size_kb: number
          file_type: string
          id: string
          original_filename: string
          processed_path: string | null
          processing_status: string
          storage_path: string
          summary: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          errors?: string[] | null
          file_size_kb: number
          file_type: string
          id?: string
          original_filename: string
          processed_path?: string | null
          processing_status?: string
          storage_path: string
          summary?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          errors?: string[] | null
          file_size_kb?: number
          file_type?: string
          id?: string
          original_filename?: string
          processed_path?: string | null
          processing_status?: string
          storage_path?: string
          summary?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      entity_type:
        | "Place"
        | "Organization"
        | "Topic"
        | "Event"
        | "Person"
        | "Concept"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      entity_type: [
        "Place",
        "Organization",
        "Topic",
        "Event",
        "Person",
        "Concept",
      ],
    },
  },
} as const
