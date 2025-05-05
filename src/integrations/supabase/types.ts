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
      characters: {
        Row: {
          background: string | null
          conflicts: string | null
          created_at: string
          description: string | null
          goals: string | null
          id: string
          image_url: string | null
          name: string
          personality: string | null
          project_id: string
          role: string | null
          updated_at: string
          visual_traits: string | null
        }
        Insert: {
          background?: string | null
          conflicts?: string | null
          created_at?: string
          description?: string | null
          goals?: string | null
          id?: string
          image_url?: string | null
          name: string
          personality?: string | null
          project_id: string
          role?: string | null
          updated_at?: string
          visual_traits?: string | null
        }
        Update: {
          background?: string | null
          conflicts?: string | null
          created_at?: string
          description?: string | null
          goals?: string | null
          id?: string
          image_url?: string | null
          name?: string
          personality?: string | null
          project_id?: string
          role?: string | null
          updated_at?: string
          visual_traits?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          number: number
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          number: number
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          number?: number
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_tokens: {
        Row: {
          call_count: number
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          last_used_at: string | null
          name: string
          scopes: Json
          token: string
          token_preview: string
          user_id: string
        }
        Insert: {
          call_count?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          name: string
          scopes?: Json
          token: string
          token_preview: string
          user_id: string
        }
        Update: {
          call_count?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          name?: string
          scopes?: Json
          token?: string
          token_preview?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          cover_image_url: string | null
          created_at: string
          duration: string | null
          genres: string[] | null
          id: string
          inspirations: string | null
          is_admin: boolean | null
          logline: string | null
          narrative_structure: string | null
          subscription_tier: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
          video_format: string | null
          world_id: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          duration?: string | null
          genres?: string[] | null
          id?: string
          inspirations?: string | null
          is_admin?: boolean | null
          logline?: string | null
          narrative_structure?: string | null
          subscription_tier?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
          video_format?: string | null
          world_id?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          duration?: string | null
          genres?: string[] | null
          id?: string
          inspirations?: string | null
          is_admin?: boolean | null
          logline?: string | null
          narrative_structure?: string | null
          subscription_tier?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          video_format?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      scenes: {
        Row: {
          character_ids: string[] | null
          color_grading: string | null
          created_at: string
          description: string
          dialog: string | null
          emotional_notes: string | null
          emotional_significance: string | null
          episode_id: string | null
          episode_title: string | null
          id: string
          keyframe_image_url: string | null
          lighting: string | null
          location: string
          production_notes: string | null
          project_id: string
          scene_number: number
          sound_design: string | null
          special_effects: string | null
          time_of_day: string
          timecode_end: string
          timecode_start: string
          transitions: string | null
          updated_at: string
          visual_composition: string | null
        }
        Insert: {
          character_ids?: string[] | null
          color_grading?: string | null
          created_at?: string
          description: string
          dialog?: string | null
          emotional_notes?: string | null
          emotional_significance?: string | null
          episode_id?: string | null
          episode_title?: string | null
          id?: string
          keyframe_image_url?: string | null
          lighting?: string | null
          location: string
          production_notes?: string | null
          project_id: string
          scene_number: number
          sound_design?: string | null
          special_effects?: string | null
          time_of_day: string
          timecode_end: string
          timecode_start: string
          transitions?: string | null
          updated_at?: string
          visual_composition?: string | null
        }
        Update: {
          character_ids?: string[] | null
          color_grading?: string | null
          created_at?: string
          description?: string
          dialog?: string | null
          emotional_notes?: string | null
          emotional_significance?: string | null
          episode_id?: string | null
          episode_title?: string | null
          id?: string
          keyframe_image_url?: string | null
          lighting?: string | null
          location?: string
          production_notes?: string | null
          project_id?: string
          scene_number?: number
          sound_design?: string | null
          special_effects?: string | null
          time_of_day?: string
          timecode_end?: string
          timecode_start?: string
          transitions?: string | null
          updated_at?: string
          visual_composition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scenes_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scenes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      unlock_codes: {
        Row: {
          code: string
          created_at: string
          expiry_at: string | null
          id: string
          is_admin: boolean
          is_single_use: boolean
          tier_level: string
          used_by: string[] | null
        }
        Insert: {
          code: string
          created_at?: string
          expiry_at?: string | null
          id?: string
          is_admin?: boolean
          is_single_use?: boolean
          tier_level: string
          used_by?: string[] | null
        }
        Update: {
          code?: string
          created_at?: string
          expiry_at?: string | null
          id?: string
          is_admin?: boolean
          is_single_use?: boolean
          tier_level?: string
          used_by?: string[] | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          drive_access_token: string | null
          drive_account_email: string | null
          drive_folder_id: string | null
          drive_folder_name: string | null
          drive_refresh_token: string | null
          drive_token_expiry: string | null
          id: string
          storage_provider: string | null
          updated_at: string
          upload_to_drive: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          drive_access_token?: string | null
          drive_account_email?: string | null
          drive_folder_id?: string | null
          drive_folder_name?: string | null
          drive_refresh_token?: string | null
          drive_token_expiry?: string | null
          id?: string
          storage_provider?: string | null
          updated_at?: string
          upload_to_drive?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          drive_access_token?: string | null
          drive_account_email?: string | null
          drive_folder_id?: string | null
          drive_folder_name?: string | null
          drive_refresh_token?: string | null
          drive_token_expiry?: string | null
          id?: string
          storage_provider?: string | null
          updated_at?: string
          upload_to_drive?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      world_categories: {
        Row: {
          content: Json | null
          created_at: string
          icon: string | null
          id: string
          name: string
          order_index: number
          type: string
          updated_at: string
          world_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          order_index?: number
          type: string
          updated_at?: string
          world_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          order_index?: number
          type?: string
          updated_at?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_categories_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      worlds: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_development_mode: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
