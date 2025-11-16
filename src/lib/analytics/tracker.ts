import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  user_id: string;
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

/**
 * Track a custom event
 */
export async function trackEvent(
  userId: string,
  event: string,
  properties?: Record<string, any>
): Promise<void> {
  try {
    // In a real implementation, this would call an analytics edge function
    // For now, we'll just log it
    console.log("[Analytics]", {
      userId,
      event,
      properties,
      timestamp: new Date().toISOString(),
    });

    // You could also store in a database table for analytics
    // await supabase.from('analytics_events').insert({...})
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}

/**
 * Track a page view
 */
export async function trackPageView(
  userId: string,
  page: string,
  referrer?: string
): Promise<void> {
  await trackEvent(userId, "page_view", {
    page,
    referrer,
    userAgent: navigator.userAgent,
  });
}

/**
 * Track scan creation
 */
export async function trackScanCreated(
  userId: string,
  scanId: string,
  scanType: string
): Promise<void> {
  await trackEvent(userId, "scan_created", {
    scanId,
    scanType,
  });
}

/**
 * Track vulnerability found
 */
export async function trackVulnerabilityFound(
  userId: string,
  scanId: string,
  severity: string
): Promise<void> {
  await trackEvent(userId, "vulnerability_found", {
    scanId,
    severity,
  });
}

/**
 * Track file upload
 */
export async function trackFileUploaded(
  userId: string,
  fileSize: number,
  fileType: string
): Promise<void> {
  await trackEvent(userId, "file_uploaded", {
    fileSizeBytes: fileSize,
    fileSizeMB: Math.round((fileSize / (1024 * 1024)) * 100) / 100,
    fileType,
  });
}

/**
 * Track payment event
 */
export async function trackPayment(
  userId: string,
  amount: number,
  currency: string,
  tier: string
): Promise<void> {
  await trackEvent(userId, "payment_success", {
    amount,
    currency,
    tier,
  });
}

/**
 * Track subscription change
 */
export async function trackSubscriptionChange(
  userId: string,
  oldTier: string,
  newTier: string
): Promise<void> {
  await trackEvent(userId, "subscription_changed", {
    oldTier,
    newTier,
  });
}

/**
 * Track error
 */
export async function trackError(
  userId: string,
  error: Error,
  context?: Record<string, any>
): Promise<void> {
  await trackEvent(userId, "error", {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}
