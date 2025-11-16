import { useState, useCallback } from "react";
import { uploadFile, UploadOptions, UploadProgress } from "@/lib/storage/upload";
import { toast } from "sonner";

export interface UseFileUploadOptions {
  onSuccess?: (path: string, publicUrl?: string) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options?: UseFileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (uploadOptions: UploadOptions) => {
      setUploading(true);
      setError(null);
      setProgress({ loaded: 0, total: uploadOptions.file.size, percentage: 0 });

      try {
        const result = await uploadFile({
          ...uploadOptions,
          onProgress: (prog) => {
            setProgress(prog);
            uploadOptions.onProgress?.(prog);
          },
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        toast.success("File uploaded successfully");
        options?.onSuccess?.(result.data!.path, result.data!.publicUrl);
        return result.data!;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        toast.error(errorMessage);
        options?.onError?.(errorMessage);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    error,
    reset,
  };
}
