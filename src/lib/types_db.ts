export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          room_id: string | null
          sender_id: string | null
          sender_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          room_id?: string | null
          sender_id?: string | null
          sender_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          room_id?: string | null
          sender_id?: string | null
          sender_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      company: {
        Row: {
          adoptedid: string[] | null
          description: string | null
          features: string[] | null
          id: string
          industry: string | null
          is_verified: boolean | null
          logo: string | null
          name: string
          participants_id: string[] | null
          projects: string[] | null
          rejectedid: string[] | null
          user_id: string | null
        }
        Insert: {
          adoptedid?: string[] | null
          description?: string | null
          features?: string[] | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          logo?: string | null
          name: string
          participants_id?: string[] | null
          projects?: string[] | null
          rejectedid?: string[] | null
          user_id?: string | null
        }
        Update: {
          adoptedid?: string[] | null
          description?: string | null
          features?: string[] | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          logo?: string | null
          name?: string
          participants_id?: string[] | null
          projects?: string[] | null
          rejectedid?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      company_applications: {
        Row: {
          address: string | null
          application_status:
            | Database["public"]["Enums"]["application_status"]
            | null
          business_detail: string | null
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          industry_id: string | null
          logo_url: string | null
          number_of_employees: number | null
          president_name: string | null
          updated_at: string | null
          website: string | null
          year_of_establishment: string | null
        }
        Insert: {
          address?: string | null
          application_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
          business_detail?: string | null
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry_id?: string | null
          logo_url?: string | null
          number_of_employees?: number | null
          president_name?: string | null
          updated_at?: string | null
          website?: string | null
          year_of_establishment?: string | null
        }
        Update: {
          address?: string | null
          application_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
          business_detail?: string | null
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry_id?: string | null
          logo_url?: string | null
          number_of_employees?: number | null
          president_name?: string | null
          updated_at?: string | null
          website?: string | null
          year_of_establishment?: string | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string | null
          icon_url: string | null
          id: string
          is_read: boolean | null
          link: string | null
          recipient_id: string
          title: string | null
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          recipient_id: string
          title?: string | null
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          recipient_id?: string
          title?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_id: string | null
          avatar_url: string | null
          bio: string | null
          company_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          profile_type: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_type?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_type?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_without_recompense: boolean
          skills: string[] | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_without_recompense?: boolean
          skills?: string[] | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_without_recompense?: boolean
          skills?: string[] | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
        }
        Relationships: []
      }
      project_applications: {
        Row: {
          applied_at: string | null
          id: string
          project_id: string
          status: string
          status_updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          id?: string
          project_id: string
          status?: string
          status_updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          id?: string
          project_id?: string
          status?: string
          status_updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          icon_name: string | null
          id: string
          skill_name: string
        }
        Insert: {
          created_at?: string
          icon_name?: string | null
          id?: string
          skill_name: string
        }
        Update: {
          created_at?: string
          icon_name?: string | null
          id?: string
          skill_name?: string
        }
        Relationships: []
      }
      student_likes: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_likes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          skills: string[] | null
          university: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          skills?: string[] | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          skills?: string[] | null
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_applyed_id: {
        Args: { p_company_id: string; p_student_id: string }
        Returns: undefined
      }
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      get_users_with_all_skills: {
        Args: { skill_ids_array: string[] }
        Returns: {
          user_id: string
        }[]
      }
      get_users_with_skills: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          id: string
          skills: Json
          username: string
        }[]
      }
      send_notification: {
        Args: {
          p_actor_id: string
          p_body: string
          p_icon_url?: string
          p_link?: string
          p_recipient_id: string
          p_title: string
        }
        Returns: undefined
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      project_status: "active" | "closed" | "draft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: ["pending", "approved", "rejected"],
      project_status: ["active", "closed", "draft"],
    },
  },
} as const
