import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export type RealtimeEventCallback<T = any> = (payload: T) => void;

/**
 * Subscribe to real-time scan updates
 */
export function subscribeScanUpdates(
  scanId: string,
  callback: RealtimeEventCallback
): RealtimeChannel {
  const channel = supabase
    .channel(`scan:${scanId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "vulnerability_scans",
        filter: `id=eq.${scanId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to all scans for a user
 */
export function subscribeUserScans(
  userId: string,
  callback: RealtimeEventCallback
): RealtimeChannel {
  const channel = supabase
    .channel(`user-scans:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "vulnerability_scans",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to vulnerability findings for a scan
 */
export function subscribeVulnerabilities(
  scanId: string,
  callback: RealtimeEventCallback
): RealtimeChannel {
  const channel = supabase
    .channel(`vulnerabilities:${scanId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "scan_findings",
        filter: `scan_id=eq.${scanId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribe(channel: RealtimeChannel): Promise<void> {
  await supabase.removeChannel(channel);
}

/**
 * Unsubscribe from all channels
 */
export async function unsubscribeAll(): Promise<void> {
  await supabase.removeAllChannels();
}
