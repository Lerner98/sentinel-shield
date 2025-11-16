import { supabase } from "@/integrations/supabase/client";
import { Profile, ApiResponse, PaginatedResponse } from "./types";

export const adminService = {
  /**
   * Get all users with pagination
   */
  async getAllUsers(
    page = 1,
    limit = 20,
    filters?: {
      search?: string;
      tier?: string;
      status?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Profile>>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("profiles")
        .select("*, subscriptions(*), user_roles(*)", { count: "exact" });

      // Apply filters
      if (filters?.search) {
        query = query.or(
          `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`
        );
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: {
          data: data || [],
          page,
          limit,
          total: count || 0,
          hasMore: (count || 0) > to + 1,
        },
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        error: {
          message: "Failed to fetch users",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Get detailed user information
   */
  async getUserDetails(userId: string): Promise<
    ApiResponse<{
      profile: Profile;
      scans: any[];
      subscription: any;
      roles: any[];
    }>
  > {
    try {
      const [profileResult, scansResult, subscriptionResult, rolesResult] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).single(),
          supabase
            .from("vulnerability_scans")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single(),
          supabase.from("user_roles").select("*").eq("user_id", userId),
        ]);

      if (profileResult.error) throw profileResult.error;

      return {
        data: {
          profile: profileResult.data,
          scans: scansResult.data || [],
          subscription: subscriptionResult.data,
          roles: rolesResult.data || [],
        },
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return {
        error: {
          message: "Failed to fetch user details",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    userId: string,
    role: "user" | "admin"
  ): Promise<ApiResponse<void>> {
    try {
      // Check if role already exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", role)
        .single();

      if (existingRole) {
        return { data: undefined };
      }

      // Add new role
      const { error } = await supabase.from("user_roles").insert([{
        user_id: userId,
        role,
      }]);

      if (error) throw error;

      return { data: undefined };
    } catch (error) {
      console.error("Error updating user role:", error);
      return {
        error: {
          message: "Failed to update user role",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<
    ApiResponse<{
      total_users: number;
      active_users: number;
      total_scans: number;
      completed_scans: number;
      total_vulnerabilities: number;
    }>
  > {
    try {
      const [usersResult, scansResult, vulnResult] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("vulnerability_scans")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("scan_findings")
          .select("*", { count: "exact", head: true }),
      ]);

      const completedScans = await supabase
        .from("vulnerability_scans")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      return {
        data: {
          total_users: usersResult.count || 0,
          active_users: usersResult.count || 0,
          total_scans: scansResult.count || 0,
          completed_scans: completedScans.count || 0,
          total_vulnerabilities: vulnResult.count || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      return {
        error: {
          message: "Failed to fetch system metrics",
          code: (error as any)?.code,
        },
      };
    }
  },
};
