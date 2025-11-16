import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const createCheckoutSchema = z.object({
  priceId: z.string(),
  userId: z.string().uuid(),
  tier: z.enum(["free", "professional", "enterprise"]),
});

export type CreateCheckoutDto = z.infer<typeof createCheckoutSchema>;

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export const stripeService = {
  /**
   * Create a Stripe Checkout session
   */
  async createCheckoutSession(
    dto: CreateCheckoutDto
  ): Promise<ApiResponse<CheckoutSession>> {
    try {
      // Validate input
      createCheckoutSchema.parse(dto);

      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            priceId: dto.priceId,
            userId: dto.userId,
            tier: dto.tier,
          },
        }
      );

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      return {
        error: {
          message: "Failed to create checkout session",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Create a customer portal session for subscription management
   */
  async createPortalSession(
    customerId: string
  ): Promise<ApiResponse<{ url: string }>> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: { customerId },
        }
      );

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Failed to create portal session:", error);
      return {
        error: {
          message: "Failed to create portal session",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(
    subscriptionId: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.functions.invoke("cancel-subscription", {
        body: { subscriptionId },
      });

      if (error) throw error;

      return { data: undefined };
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      return {
        error: {
          message: "Failed to cancel subscription",
          code: (error as any)?.code,
        },
      };
    }
  },
};
