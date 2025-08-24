export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      cleanup_logs: {
        Row: {
          cleanup_type: string
          error_message: string | null
          executed_at: string | null
          id: string
          records_affected: number
          status: string | null
        }
        Insert: {
          cleanup_type: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          records_affected?: number
          status?: string | null
        }
        Update: {
          cleanup_type?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          records_affected?: number
          status?: string | null
        }
        Relationships: []
      }
      coaching_groups: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "coaching_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      drill_shares: {
        Row: {
          created_at: string | null
          drill_id: string
          id: string
          permission_level: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Insert: {
          created_at?: string | null
          drill_id: string
          id?: string
          permission_level?: string
          shared_by_user_id: string
          shared_with_user_id: string
        }
        Update: {
          created_at?: string | null
          drill_id?: string
          id?: string
          permission_level?: string
          shared_by_user_id?: string
          shared_with_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drill_shares_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
        ]
      }
      drills: {
        Row: {
          age_groups: string[] | null
          canvas_data: Json | null
          category: string
          coaching_notes: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          duration: number | null
          execution_instructions: string | null
          id: string
          is_public: boolean | null
          name: string
          organization_id: string | null
          parent_drill_id: string | null
          shared_by: string | null
          shared_with: string[] | null
          snapshot_url: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_groups?: string[] | null
          canvas_data?: Json | null
          category: string
          coaching_notes?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          duration?: number | null
          execution_instructions?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          organization_id?: string | null
          parent_drill_id?: string | null
          shared_by?: string | null
          shared_with?: string[] | null
          snapshot_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_groups?: string[] | null
          canvas_data?: Json | null
          category?: string
          coaching_notes?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          duration?: number | null
          execution_instructions?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          organization_id?: string | null
          parent_drill_id?: string | null
          shared_by?: string | null
          shared_with?: string[] | null
          snapshot_url?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "drills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drills_parent_drill_id_fkey"
            columns: ["parent_drill_id"]
            isOneToOne: false
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invitations: {
        Row: {
          accepted_at: string | null
          email: string
          group_id: string
          id: string
          invited_at: string | null
          invited_by: string
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          email: string
          group_id: string
          id?: string
          invited_at?: string | null
          invited_by: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          email?: string
          group_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_invitations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "coaching_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          added_at: string | null
          added_by: string
          group_id: string
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          added_by: string
          group_id: string
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string
          group_id?: string
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "coaching_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number
          amount_total: number
          created_at: string
          currency: string
          due_date: string | null
          hosted_invoice_url: string | null
          id: string
          invoice_number: string | null
          invoice_pdf: string | null
          lines: Json | null
          metadata: Json | null
          organization_id: string
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_customer_id: string
          stripe_invoice_id: string
          updated_at: string
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          amount_total: number
          created_at?: string
          currency?: string
          due_date?: string | null
          hosted_invoice_url?: string | null
          id?: string
          invoice_number?: string | null
          invoice_pdf?: string | null
          lines?: Json | null
          metadata?: Json | null
          organization_id: string
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status: string
          stripe_customer_id: string
          stripe_invoice_id: string
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          amount_total?: number
          created_at?: string
          currency?: string
          due_date?: string | null
          hosted_invoice_url?: string | null
          id?: string
          invoice_number?: string | null
          invoice_pdf?: string | null
          lines?: Json | null
          metadata?: Json | null
          organization_id?: string
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_invoice_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_member_rate_limits: {
        Row: {
          action: string
          attempted_at: string
          id: string
          ip_address: unknown | null
          organization_id: string
          user_id: string
        }
        Insert: {
          action: string
          attempted_at?: string
          id?: string
          ip_address?: unknown | null
          organization_id: string
          user_id: string
        }
        Update: {
          action?: string
          attempted_at?: string
          id?: string
          ip_address?: unknown | null
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_member_rate_limits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_member_rate_limits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          removed_at: string | null
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          removed_at?: string | null
          role: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          removed_at?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          logo_url: string | null
          metadata: Json | null
          name: string
          seat_limit: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
          seat_limit?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          seat_limit?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_drills: {
        Row: {
          created_at: string | null
          drill_coaching_notes: string | null
          drill_description: string | null
          drill_duration: number
          drill_id: string | null
          drill_name: string
          drill_snapshot_url: string | null
          drill_steps: string | null
          id: string
          plan_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          drill_coaching_notes?: string | null
          drill_description?: string | null
          drill_duration: number
          drill_id?: string | null
          drill_name: string
          drill_snapshot_url?: string | null
          drill_steps?: string | null
          id?: string
          plan_id: string
          sort_order: number
        }
        Update: {
          created_at?: string | null
          drill_coaching_notes?: string | null
          drill_description?: string | null
          drill_duration?: number
          drill_id?: string | null
          drill_name?: string
          drill_snapshot_url?: string | null
          drill_steps?: string | null
          id?: string
          plan_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_drills_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_drills_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "practice_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_shares: {
        Row: {
          group_id: string
          id: string
          plan_id: string
          shared_at: string | null
          shared_by: string
        }
        Insert: {
          group_id: string
          id?: string
          plan_id: string
          shared_at?: string | null
          shared_by: string
        }
        Update: {
          group_id?: string
          id?: string
          plan_id?: string
          shared_at?: string | null
          shared_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_shares_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "coaching_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_shares_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "practice_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_plans: {
        Row: {
          age_groups: string[] | null
          created_at: string | null
          date: string
          deleted_at: string | null
          duration: number | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_groups?: string[] | null
          created_at?: string | null
          date: string
          deleted_at?: string | null
          duration?: number | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_groups?: string[] | null
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          duration?: number | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "practice_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_drill_metadata: {
        Row: {
          created_at: string | null
          drill_id: string
          is_favorite: boolean | null
          last_used: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          drill_id: string
          is_favorite?: boolean | null
          last_used?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          drill_id?: string
          is_favorite?: boolean | null
          last_used?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_drill_metadata_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          deletion_requested_at: string | null
          drill_count: number
          email: string
          group_count: number
          id: string
          practice_plan_count: number
          social_avatar_url: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          trial_started_at: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_requested_at?: string | null
          drill_count?: number
          email: string
          group_count?: number
          id?: string
          practice_plan_count?: number
          social_avatar_url?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_started_at?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deletion_requested_at?: string | null
          drill_count?: number
          email?: string
          group_count?: number
          id?: string
          practice_plan_count?: number
          social_avatar_url?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_started_at?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      coach_activity_summary: {
        Row: {
          coaching_group_count: number | null
          days_inactive: number | null
          drill_count: number | null
          email: string | null
          has_signed_up: boolean | null
          is_active: boolean | null
          last_activity_at: string | null
          organization_id: string | null
          practice_plan_count: number | null
          role: string | null
          total_content_count: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members_with_profiles: {
        Row: {
          added_at: string | null
          added_by: string | null
          avatar_url: string | null
          email: string | null
          group_id: string | null
          id: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "coaching_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_content_counts: {
        Row: {
          content_type: string | null
          count: number | null
          organization_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      organization_member_analytics: {
        Row: {
          days_inactive: number | null
          email: string | null
          has_signed_up: boolean | null
          id: string | null
          individual_subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          invited_at: string | null
          is_active: boolean | null
          joined_at: string | null
          last_activity_at: string | null
          organization_id: string | null
          removed_at: string | null
          role: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_statistics_mv"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_statistics_mv: {
        Row: {
          active_members: number | null
          avg_drills_per_active_member: number | null
          avg_plans_per_active_member: number | null
          last_refreshed: string | null
          onboarded_members: number | null
          organization_id: string | null
          organization_name: string | null
          seat_limit: number | null
          subscription_status: string | null
          total_coaching_groups: number | null
          total_drills: number | null
          total_members: number | null
          total_practice_plans: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_drill_to_plan: {
        Args: {
          drill_name: string
          drill_owner_email: string
          duration_override: number
          plan_name: string
          plan_owner_email: string
          sort_position: number
        }
        Returns: undefined
      }
      add_organization_member_with_rate_limit: {
        Args: { p_email: string; p_organization_id: string; p_role?: string }
        Returns: {
          email: string
          id: string
          role: string
          status: string
        }[]
      }
      associate_existing_user_with_pending_membership: {
        Args: { user_email: string }
        Returns: {
          associated_at: string
          organization_id: string
          role: string
        }[]
      }
      bulk_add_organization_members_with_rate_limit: {
        Args: { p_emails: string[]; p_organization_id: string; p_role?: string }
        Returns: {
          added_count: number
          errors: string[]
          failed_count: number
        }[]
      }
      can_create_drill: {
        Args: { user_id: string }
        Returns: boolean
      }
      can_create_group: {
        Args: { user_id: string }
        Returns: boolean
      }
      can_create_practice_plan: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_member_operation_rate_limit: {
        Args: {
          p_action: string
          p_ip_address?: unknown
          p_organization_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_subscription_restore_eligibility: {
        Args: { user_id: string }
        Returns: Json
      }
      check_username_availability: {
        Args: { username_to_check: string }
        Returns: boolean
      }
      cleanup_deleted_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      count_org_members: {
        Args: { p_org_id: string }
        Returns: number
      }
      delete_user_account: {
        Args: { user_id: string }
        Returns: undefined
      }
      get_accessible_coaching_groups: {
        Args: { user_uuid: string }
        Returns: string[]
      }
      get_accessible_practice_plans: {
        Args: { user_uuid: string }
        Returns: string[]
      }
      get_cleanup_job_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean
          command: string
          database: string
          jobid: number
          jobname: string
          nodename: string
          nodeport: number
          schedule: string
          username: string
        }[]
      }
      get_drill_id: {
        Args: { drill_name: string; owner_email: string }
        Returns: string
      }
      get_group_id: {
        Args: { group_name: string }
        Returns: string
      }
      get_my_rate_limit_status: {
        Args: { p_organization_id: string }
        Returns: {
          action: string
          attempts_used: number
          max_attempts: number
          reset_at: string
        }[]
      }
      get_plan_id: {
        Args: { owner_email: string; plan_name: string }
        Returns: string
      }
      get_user_id: {
        Args: { user_email: string }
        Returns: string
      }
      get_user_org_role: {
        Args: { p_org_id: string; p_user_id?: string }
        Returns: string
      }
      get_user_organization: {
        Args: { p_user_id?: string }
        Returns: string
      }
      get_user_organization_details: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          id: string
          logo_url: string
          metadata: Json
          name: string
          seat_limit: number
          stripe_customer_id: string
          stripe_subscription_id: string
          subscription_status: string
          updated_at: string
        }[]
      }
      get_user_organizations: {
        Args: { user_uuid: string }
        Returns: string[]
      }
      handle_user_deletion: {
        Args: { user_id: string }
        Returns: undefined
      }
      is_org_admin: {
        Args: { p_org_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { p_org_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_organization_admin: {
        Args: { org_uuid: string; user_uuid: string }
        Returns: boolean
      }
      refresh_organization_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      relative_date: {
        Args: { days_offset: number }
        Returns: string
      }
      relative_timestamp: {
        Args: { days_offset: number; time_str?: string }
        Returns: string
      }
      scheduled_cleanup_deleted_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_group_invitations: {
        Args: { p_emails: string[]; p_group_id: string }
        Returns: {
          accepted_at: string | null
          email: string
          group_id: string
          id: string
          invited_at: string | null
          invited_by: string
          role: string | null
          status: string | null
          user_id: string | null
        }[]
      }
      update_user_subscription_status: {
        Args:
          | {
              new_status: Database["public"]["Enums"]["subscription_status"]
              user_id: string
            }
          | {
              new_status: string
              new_tier: string
              rc_customer_id?: string
              user_id: string
            }
        Returns: undefined
      }
      user_exists: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      subscription_status: "free" | "premium" | "expired"
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
      subscription_status: ["free", "premium", "expired"],
    },
  },
} as const