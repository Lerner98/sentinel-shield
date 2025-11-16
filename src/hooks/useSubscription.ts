import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscriptionService";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await subscriptionService.getByUserId(user.id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
  });

  const subscription = query.data;

  return {
    ...query,
    subscription,
    isActive: subscription?.status === "active",
    isCancelled: subscription?.cancel_at_period_end || false,
    tier: subscription?.tier || "free",
  };
}

export function useFeatureAccess(feature: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["featureAccess", user?.id, feature],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await subscriptionService.checkFeatureAccess(user.id, feature);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
  });
}

export function useTierLimits() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tierLimits", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await subscriptionService.getTierLimits(user.id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
  });
}
