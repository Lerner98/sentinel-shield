import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeScanUpdates, unsubscribe } from "@/lib/realtime/subscriptions";
import { toast } from "sonner";
import { VulnerabilityScan } from "@/services/types";

/**
 * Subscribe to real-time updates for a specific scan
 */
export function useRealtimeScanUpdates(scanId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!scanId) return;

    const channel = subscribeScanUpdates(scanId, (scan: VulnerabilityScan) => {
      // Update the cache with new scan data
      queryClient.setQueryData(["scan", scanId], scan);
      queryClient.invalidateQueries({ queryKey: ["scans"] });

      // Show toast notification on status changes
      if (scan.status === "completed") {
        toast.success("Scan completed!", {
          description: `Found ${scan.total_vulnerabilities || 0} vulnerabilities`,
        });
      } else if (scan.status === "failed") {
        toast.error("Scan failed", {
          description: "Please try again",
        });
      }
    });

    return () => {
      unsubscribe(channel);
    };
  }, [scanId, queryClient]);
}
