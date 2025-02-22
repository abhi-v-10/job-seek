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
      jobs: {
        Row: {
          category: Database["public"]["Enums"]["job_category"]
          company_name: string | null
          created_at: string | null
          daily_hours: number | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          hourly_wage_max: number | null
          hourly_wage_min: number | null
          id: string
          location: string
          position: Database["public"]["Enums"]["corporate_position"] | null
          salary_range_max: number | null
          salary_range_min: number | null
          updated_at: string | null
          user_id: string
          work_type: Database["public"]["Enums"]["domestic_work_type"] | null
          years_of_experience: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["job_category"]
          company_name?: string | null
          created_at?: string | null
          daily_hours?: number | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          hourly_wage_max?: number | null
          hourly_wage_min?: number | null
          id?: string
          location: string
          position?: Database["public"]["Enums"]["corporate_position"] | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          updated_at?: string | null
          user_id: string
          work_type?: Database["public"]["Enums"]["domestic_work_type"] | null
          years_of_experience?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["job_category"]
          company_name?: string | null
          created_at?: string | null
          daily_hours?: number | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          hourly_wage_max?: number | null
          hourly_wage_min?: number | null
          id?: string
          location?: string
          position?: Database["public"]["Enums"]["corporate_position"] | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          updated_at?: string | null
          user_id?: string
          work_type?: Database["public"]["Enums"]["domestic_work_type"] | null
          years_of_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          job_id: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          job_id?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          job_id?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          mobile_number: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          mobile_number?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          mobile_number?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: Database["public"]["Enums"]["skill_category"] | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["skill_category"] | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["skill_category"] | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
      corporate_position:
        | "software_developer"
        | "software_designer"
        | "frontend_developer"
        | "backend_developer"
        | "full_stack_developer"
        | "ui_ux_designer"
        | "project_manager"
        | "product_manager"
        | "qa_engineer"
        | "devops_engineer"
        | "data_scientist"
        | "system_architect"
      domestic_work_type:
        | "gardening"
        | "housekeeping"
        | "cooking"
        | "childcare"
        | "elderly_care"
        | "driving"
        | "pet_care"
        | "home_maintenance"
      employment_type: "full_time" | "part_time"
      job_category: "corporate" | "domestic"
      skill_category: "technical" | "soft" | "language" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
