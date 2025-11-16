import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "@/services/types";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  bucket: "scan-reports" | "avatars";
  path: string;
  file: File;
  onProgress?: (progress: UploadProgress) => void;
}

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl?: string;
}

/**
 * Upload a file to Supabase storage with progress tracking
 */
export async function uploadFile(
  options: UploadOptions
): Promise<ApiResponse<UploadResult>> {
  const { bucket, path, file, onProgress } = options;

  try {
    // Validate file size (max 20MB for reports, 5MB for avatars)
    const maxSize = bucket === "scan-reports" ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        error: {
          message: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
          code: "FILE_TOO_LARGE",
        },
      };
    }

    // Validate file type
    const allowedTypes = {
      "scan-reports": ["application/pdf", "text/csv", "application/json"],
      avatars: ["image/jpeg", "image/png", "image/webp"],
    };

    if (!allowedTypes[bucket].includes(file.type)) {
      return {
        error: {
          message: "Invalid file type",
          code: "INVALID_FILE_TYPE",
        },
      };
    }

    // Track progress manually (Supabase doesn't provide native progress)
    if (onProgress) {
      onProgress({ loaded: 0, total: file.size, percentage: 0 });
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    if (onProgress) {
      onProgress({ loaded: file.size, total: file.size, percentage: 100 });
    }

    // Get public URL if bucket is public
    let publicUrl: string | undefined;
    if (bucket === "avatars") {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      publicUrl = urlData.publicUrl;
    }

    return {
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl,
      },
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      error: {
        message: "Failed to upload file",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultiple(
  files: UploadOptions[]
): Promise<ApiResponse<UploadResult[]>> {
  try {
    const results = await Promise.all(files.map((file) => uploadFile(file)));

    // Check if any uploads failed
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      return {
        error: {
          message: `${errors.length} files failed to upload`,
          code: "PARTIAL_UPLOAD_FAILURE",
        },
      };
    }

    return {
      data: results.map((r) => r.data!),
    };
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    return {
      error: {
        message: "Failed to upload files",
        code: (error as any)?.code,
      },
    };
  }
}

/**
 * Generate a unique file path with timestamp
 */
export function generateFilePath(
  userId: string,
  filename: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = prefix
    ? `${userId}/${prefix}/${timestamp}-${sanitizedFilename}`
    : `${userId}/${timestamp}-${sanitizedFilename}`;
  return path;
}
