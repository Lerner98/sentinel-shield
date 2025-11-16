import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vulnerabilityService } from "@/services/vulnerabilityService";
import { CreateVulnerabilityDto, SeverityLevel } from "@/services/types";
import { toast } from "sonner";

export function useVulnerabilities(scanId: string | undefined) {
  return useQuery({
    queryKey: ["vulnerabilities", scanId],
    queryFn: async () => {
      if (!scanId) throw new Error("Scan ID required");
      const result = await vulnerabilityService.getByScanId(scanId);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!scanId,
  });
}

export function useVulnerability(vulnId: string | undefined) {
  return useQuery({
    queryKey: ["vulnerability", vulnId],
    queryFn: async () => {
      if (!vulnId) throw new Error("Vulnerability ID required");
      const result = await vulnerabilityService.getById(vulnId);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!vulnId,
  });
}

export function useCreateVulnerability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateVulnerabilityDto) => {
      const result = await vulnerabilityService.create(dto);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vulnerabilities", variables.scan_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["scan", variables.scan_id],
      });
      toast.success("Vulnerability recorded");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useVulnerabilityCounts(scanId: string | undefined) {
  return useQuery({
    queryKey: ["vulnerabilityCounts", scanId],
    queryFn: async () => {
      if (!scanId) throw new Error("Scan ID required");
      const result = await vulnerabilityService.getCountBySeverity(scanId);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!scanId,
  });
}

export function useTopVulnerabilities(limit = 10) {
  return useQuery({
    queryKey: ["topVulnerabilities", limit],
    queryFn: async () => {
      // This would need user ID - simplified for now
      throw new Error("Not implemented");
    },
    enabled: false,
  });
}

export function useVulnerabilitiesBySeverity(
  scanId: string | undefined,
  severity: SeverityLevel
) {
  return useQuery({
    queryKey: ["vulnerabilities", scanId, severity],
    queryFn: async () => {
      if (!scanId) throw new Error("Scan ID required");
      const result = await vulnerabilityService.getBySeverity(scanId, severity);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!scanId,
  });
}
