import { useQuery } from "@tanstack/react-query";
import { getUserStorageUsage } from "@/lib/storage/management";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useStorageQuota() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["storageQuota", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await getUserStorageUsage(user.id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Show warning toast when approaching limit
  const { data: quota } = query;
  if (quota && quota.percentage >= 90) {
    toast.warning(
      `Storage almost full: ${quota.percentage}% used (${quota.used}MB / ${quota.total}MB)`
    );
  }

  return query;
}

export function useCanUpload(fileSizeBytes: number) {
  const { data: quota, isLoading } = useStorageQuota();

  if (isLoading || !quota) {
    return { canUpload: false, reason: "Checking quota..." };
  }

  // Convert bytes to MB
  const fileSizeMB = fileSizeBytes / (1024 * 1024);

  // Check if unlimited
  if (quota.total === -1) {
    return { canUpload: true, reason: null };
  }

  // Check if file would exceed quota
  if (quota.used + fileSizeMB > quota.total) {
    return {
      canUpload: false,
      reason: `Not enough storage. File size: ${fileSizeMB.toFixed(2)}MB, Available: ${quota.available.toFixed(2)}MB`,
    };
  }

  return { canUpload: true, reason: null };
}
