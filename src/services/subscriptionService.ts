import { supabase } from "@/integrations/supabase/client";
import { Subscription, SubscriptionTier, ApiResponse } from "./types";

export const subscriptionService = {
  /**
   * Get user's subscription
   */
  async getByUserId(userId: string): Promise<ApiResponse<Subscription>> {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return {
        error: {
          message: "Failed to fetch subscription",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Check if user has access to a feature based on tier
   */
  async checkFeatureAccess(
    userId: string,
    feature: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("tier, status")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      // Feature access rules
      const features: Record<string, SubscriptionTier[]> = {
        basic_scans: ["free", "professional", "enterprise"],
        advanced_scans: ["professional", "enterprise"],
        custom_scans: ["professional", "enterprise"],
        api_access: ["professional", "enterprise"],
        priority_support: ["enterprise"],
        unlimited_scans: ["enterprise"],
        team_collaboration: ["enterprise"],
      };

      const allowedTiers = features[feature] || [];
      const hasAccess =
        subscription.status === "active" &&
        allowedTiers.includes(subscription.tier as SubscriptionTier);

      return { data: hasAccess };
    } catch (error) {
      console.error("Error checking feature access:", error);
      return {
        error: {
          message: "Failed to check feature access",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Get tier limits for a user
   */
  async getTierLimits(userId: string): Promise<
    ApiResponse<{
      scans_per_month: number;
      storage_mb: number;
      api_calls_per_day: number;
    }>
  > {
    try {
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("tier")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      const limits = {
        free: {
          scans_per_month: 5,
          storage_mb: 100,
          api_calls_per_day: 100,
        },
        starter: {
          scans_per_month: 50,
          storage_mb: 1000,
          api_calls_per_day: 1000,
        },
        pro: {
          scans_per_month: 200,
          storage_mb: 5000,
          api_calls_per_day: 5000,
        },
        enterprise: {
          scans_per_month: -1, // unlimited
          storage_mb: -1, // unlimited
          api_calls_per_day: -1, // unlimited
        },
      };

      const tierLimits =
        limits[subscription.tier as keyof typeof limits] || limits.free;

      return { data: tierLimits };
    } catch (error) {
      console.error("Error getting tier limits:", error);
      return {
        error: {
          message: "Failed to get tier limits",
          code: (error as any)?.code,
        },
      };
    }
  },
};
