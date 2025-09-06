export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "students" | "company";

export interface BaseProfile {
  id: string; // Corresponds to the user's ID in Supabase Auth
  updated_at: string;
  username: string;
  avatar_url: string;
  website: string;
  profile_type: UserRole;
}

export interface students extends BaseProfile {
  profile_type: "students";
  first_name: string;
  last_name: string;
}

export interface company extends BaseProfile {
  profile_type: "company";
  company_name: string;
}

export type ProfileType = students | company;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          avatar_url: string | null;
          website: string | null;
          profile_type: UserRole | null;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          profile_type?: UserRole | null;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          profile_type?: UserRole | null;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}