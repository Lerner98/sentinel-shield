import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scanService } from "@/services/scanService";
import { CreateScanDto, UpdateScanStatusDto } from "@/services/types";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useScans(page = 1, limit = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["scans", user?.id, page, limit],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await scanService.getAll(user.id, page, limit);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
  });
}

export function useScan(scanId: string | undefined) {
  return useQuery({
    queryKey: ["scan", scanId],
    queryFn: async () => {
      if (!scanId) throw new Error("Scan ID required");
      const result = await scanService.getById(scanId);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!scanId,
  });
}

export function useCreateScan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateScanDto) => {
      if (!user) throw new Error("User not authenticated");
      const result = await scanService.create(user.id, dto);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["scanStatistics"] });
      toast.success("Scan created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateScanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scanId,
      dto,
    }: {
      scanId: string;
      dto: UpdateScanStatusDto;
    }) => {
      const result = await scanService.updateStatus(scanId, dto);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scan", variables.scanId] });
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["scanStatistics"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scanId: string) => {
      const result = await scanService.delete(scanId);
      if (result.error) throw new Error(result.error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["scanStatistics"] });
      toast.success("Scan deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useScanStatistics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["scanStatistics", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const result = await scanService.getStatistics(user.id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!user,
  });
}

export function useExportScan() {
  return useMutation({
    mutationFn: async ({
      scanId,
      format,
    }: {
      scanId: string;
      format: "pdf" | "csv" | "json";
    }) => {
      const result = await scanService.exportResults(scanId, format);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (blob, variables) => {
      // Trigger download
      const url = URL.createObjectURL(blob!);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scan-${variables.scanId}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Scan exported successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
