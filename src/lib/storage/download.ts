import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "@/services/types";

export interface DownloadOptions {
  bucket: "scan-reports" | "avatars";
  path: string;
}

/**
 * Download a file from storage
 */
export async function downloadFile(
  options: DownloadOptions
): Promise<ApiResponse<Blob>> {
  const { bucket, path } = options;

  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error downloading file:", error);
    return {
      error: {
        message: "Failed to download file",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Get a signed URL for temporary file access
 */
export async function getSignedUrl(
  options: DownloadOptions & { expiresIn?: number }
): Promise<ApiResponse<string>> {
  const { bucket, path, expiresIn = 3600 } = options;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return { data: data.signedUrl };
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return {
      error: {
        message: "Failed to get signed URL",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Stream a large file (for downloads > 5MB)
 */
export async function streamFile(
  options: DownloadOptions,
  onProgress?: (loaded: number, total: number) => void
): Promise<ApiResponse<Blob>> {
  const { bucket, path } = options;

  try {
    // Get file metadata first to know the size
    const { data: fileList, error: listError } = await supabase.storage
      .from(bucket)
      .list(path.split("/").slice(0, -1).join("/"), {
        search: path.split("/").pop(),
      });

    if (listError) throw listError;

    const fileMetadata = fileList?.[0];
    const totalSize = fileMetadata?.metadata?.size || 0;

    // Download the file
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;

    if (onProgress) {
      onProgress(data.size, totalSize);
    }

    return { data };
  } catch (error) {
    console.error("Error streaming file:", error);
    return {
      error: {
        message: "Failed to stream file",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Get public URL for a file (only works for public buckets)
 */
export function getPublicUrl(
  bucket: "scan-reports" | "avatars",
  path: string
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
