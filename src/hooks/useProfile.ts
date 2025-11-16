import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { ProfileUpdateDto } from "@/services/types";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await userService.getProfile(user.id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ProfileUpdateDto) => {
      if (!user) throw new Error("User not authenticated");
      const result = await userService.updateProfile(user.id, dto);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUsageStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["usageStats", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await userService.getUsageStats(user.id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useDeleteAccount() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await userService.deleteAccount(user.id);
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: async () => {
      await signOut();
      queryClient.clear();
      toast.success("Account deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
