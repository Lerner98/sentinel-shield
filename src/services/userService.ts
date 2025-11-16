import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileUpdateDto, UsageMetrics, ApiResponse } from "./types";

export const userService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return {
        error: {
          message: "Failed to fetch profile",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    dto: ProfileUpdateDto
  ): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: dto.full_name,
          company_name: dto.company_name,
          avatar_url: dto.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        error: {
          message: "Failed to update profile",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Create user profile
   */
  async createProfile(
    userId: string,
    email: string,
    fullName?: string
  ): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email,
          full_name: fullName,
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error creating profile:", error);
      return {
        error: {
          message: "Failed to create profile",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<ApiResponse<void>> {
    try {
      // This would typically be handled by an edge function
      // to ensure proper cascade deletion and cleanup
      const { error } = await supabase.functions.invoke("delete-account", {
        body: { userId },
      });

      if (error) throw error;

      return { data: undefined };
    } catch (error) {
      console.error("Error deleting account:", error);
      return {
        error: {
          message: "Failed to delete account",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Get user usage statistics
   */
  async getUsageStats(userId: string): Promise<ApiResponse<UsageMetrics>> {
    try {
      // Get subscription tier to determine limits
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("tier")
        .eq("user_id", userId)
        .single();

      const tier = subscription?.tier || "free";

      // Get actual usage
      const [scansResult, storageResult] = await Promise.all([
        supabase
          .from("vulnerability_scans")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase.storage.from("scan-reports").list(userId),
      ]);

      const scansCount = scansResult.count || 0;
      
      // Calculate storage used (in MB)
      const storageUsed = Math.round(
        ((storageResult.data || []).reduce((sum, file) => sum + (file.metadata?.size || 0), 0)) /
          (1024 * 1024)
      );

      // Default limits based on tier
      const limits = {
        free: { scans: 5, storage: 100, api_calls: 100 },
        starter: { scans: 50, storage: 1000, api_calls: 1000 },
        pro: { scans: 200, storage: 5000, api_calls: 5000 },
        enterprise: { scans: -1, storage: -1, api_calls: -1 },
      }[tier] || { scans: 5, storage: 100, api_calls: 100 };

      const metrics: UsageMetrics = {
        scans_count: scansCount,
        scans_limit: limits.scans,
        storage_used: storageUsed,
        storage_limit: limits.storage,
        api_calls_count: 0, // Would be tracked separately
        api_calls_limit: limits.api_calls,
      };

      return { data: metrics };
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      return {
        error: {
          message: "Failed to fetch usage statistics",
          code: (error as any)?.code,
        },
      };
    }
  },
};
