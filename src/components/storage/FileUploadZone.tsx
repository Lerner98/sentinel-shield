import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "@/hooks/useFileUpload";
import { generateFilePath } from "@/lib/storage/upload";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface FileUploadZoneProps {
  bucket: "scan-reports" | "avatars";
  accept?: Record<string, string[]>;
  maxSize?: number;
  onSuccess?: (path: string, publicUrl?: string) => void;
}

export function FileUploadZone({
  bucket,
  accept,
  maxSize = 20 * 1024 * 1024, // 20MB default
  onSuccess,
}: FileUploadZoneProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, uploading, progress, reset } = useFileUpload({ onSuccess });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    const path = generateFilePath(user.id, selectedFile.name);

    await upload({
      bucket,
      path,
      file: selectedFile,
    });

    setSelectedFile(null);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    reset();
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-primary">Drop the file here...</p>
        ) : (
          <>
            <p className="text-foreground mb-2">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </>
        )}
      </div>

      {fileRejections.length > 0 && (
        <div className="text-sm text-destructive">
          {fileRejections[0].errors.map((error) => (
            <p key={error.code}>{error.message}</p>
          ))}
        </div>
      )}

      {selectedFile && !uploading && (
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} size="sm">
              Upload
            </Button>
            <Button onClick={handleCancel} size="sm" variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {uploading && progress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading {selectedFile?.name}</span>
            <span>{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} />
        </div>
      )}
    </div>
  );
}
