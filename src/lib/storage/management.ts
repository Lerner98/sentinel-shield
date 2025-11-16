import { supabase } from "@/integrations/supabase/client";
import { ApiResponse, StorageQuota } from "@/services/types";
import { FileObject } from "@supabase/storage-js";

export interface ListFilesOptions {
  bucket: "scan-reports" | "avatars";
  folder?: string;
  limit?: number;
  offset?: number;
  sortBy?: {
    column: "name" | "created_at" | "updated_at";
    order: "asc" | "desc";
  };
}

/**
 * List files in a bucket with pagination
 */
export async function listUserFiles(
  userId: string,
  options: ListFilesOptions
): Promise<ApiResponse<FileObject[]>> {
  const { bucket, folder, limit = 100, offset = 0, sortBy } = options;

  try {
    const path = folder ? `${userId}/${folder}` : userId;

    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit,
      offset,
      sortBy: sortBy
        ? { column: sortBy.column, order: sortBy.order }
        : undefined,
    });

    if (error) throw error;

    return { data: data || [] };
  } catch (error) {
    console.error("Error listing files:", error);
    return {
      error: {
        message: "Failed to list files",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Delete a file
 */
export async function deleteFile(
  bucket: "scan-reports" | "avatars",
  path: string
): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    return { data: undefined };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      error: {
        message: "Failed to delete file",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Delete multiple files
 */
export async function deleteFiles(
  bucket: "scan-reports" | "avatars",
  paths: string[]
): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;

    return { data: undefined };
  } catch (error) {
    console.error("Error deleting files:", error);
    return {
        error: {
        message: "Failed to delete files",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Get user's storage usage
 */
export async function getUserStorageUsage(
  userId: string
): Promise<ApiResponse<StorageQuota>> {
  try {
    // Get files from both buckets
    const [reportsResult, avatarsResult] = await Promise.all([
      supabase.storage.from("scan-reports").list(userId),
      supabase.storage.from("avatars").list(userId),
    ]);

    if (reportsResult.error) throw reportsResult.error;
    if (avatarsResult.error) throw avatarsResult.error;

    // Calculate total size in bytes
    const reportsSize = (reportsResult.data || []).reduce(
      (sum, file) => sum + (file.metadata?.size || 0),
      0
    );
    const avatarsSize = (avatarsResult.data || []).reduce(
      (sum, file) => sum + (file.metadata?.size || 0),
      0
    );

    const totalBytes = reportsSize + avatarsSize;
    const totalMB = totalBytes / (1024 * 1024);

    // Get user's storage limit from subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier")
      .eq("user_id", userId)
      .single();

    const tier = subscription?.tier || "free";
    const limits = {
      free: 100,
      starter: 1000,
      pro: 5000,
      enterprise: -1, // unlimited
    };

    const limitMB = limits[tier as keyof typeof limits] || 100;

    const quota: StorageQuota = {
      used: Math.round(totalMB * 100) / 100,
      total: limitMB,
      percentage: limitMB > 0 ? Math.round((totalMB / limitMB) * 100) : 0,
      available: limitMB > 0 ? Math.max(0, limitMB - totalMB) : -1,
    };

    return { data: quota };
  } catch (error) {
    console.error("Error getting storage usage:", error);
    return {
      error: {
        message: "Failed to get storage usage",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Clean up expired files (older than specified days)
 */
export async function cleanupExpiredFiles(
  userId: string,
  daysOld = 90
): Promise<ApiResponse<number>> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Get all user files from scan-reports
    const { data: files, error } = await supabase.storage
      .from("scan-reports")
      .list(userId);

    if (error) throw error;

    // Filter files older than cutoff date
    const expiredFiles =
      files?.filter((file) => {
        const createdAt = new Date(file.created_at || "");
        return createdAt < cutoffDate;
      }) || [];

    if (expiredFiles.length === 0) {
      return { data: 0 };
    }

    // Delete expired files
    const paths = expiredFiles.map((file) => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from("scan-reports")
      .remove(paths);

    if (deleteError) throw deleteError;

    return { data: expiredFiles.length };
  } catch (error) {
    console.error("Error cleaning up expired files:", error);
    return {
      error: {
        message: "Failed to clean up expired files",
        code: (error as any)?.code,
      },
    };
  }
}
