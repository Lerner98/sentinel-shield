import { z } from "zod";
import { Database } from "@/integrations/supabase/types";

// ============= Database Types =============
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type VulnerabilityScan = Database["public"]["Tables"]["vulnerability_scans"]["Row"];
export type VulnerabilityScanInsert = Database["public"]["Tables"]["vulnerability_scans"]["Insert"];
export type VulnerabilityScanUpdate = Database["public"]["Tables"]["vulnerability_scans"]["Update"];

export type ScanFinding = Database["public"]["Tables"]["scan_findings"]["Row"];
export type ScanFindingInsert = Database["public"]["Tables"]["scan_findings"]["Insert"];

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];
export type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"];

export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

// ============= Enums =============
export type ScanStatus = Database["public"]["Enums"]["scan_status"];
export type SeverityLevel = Database["public"]["Enums"]["severity_level"];
export type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];
export type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];
export type AppRole = Database["public"]["Enums"]["app_role"];

// ============= Validation Schemas =============

// Profile Schemas
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  company_name: z.string().max(200).optional(),
  avatar_url: z.string().url().optional(),
});

export type ProfileUpdateDto = z.infer<typeof profileUpdateSchema>;

// Scan Schemas
export const createScanSchema = z.object({
  scan_name: z.string().min(1).max(100).trim(),
  target_url: z.string().url().max(500),
  scan_type: z.enum(["full", "quick", "custom"]),
});

export type CreateScanDto = z.infer<typeof createScanSchema>;

export const updateScanStatusSchema = z.object({
  status: z.enum(["pending", "running", "completed", "failed"]),
  progress: z.number().min(0).max(100).optional(),
  total_vulnerabilities: z.number().int().nonnegative().optional(),
  critical_count: z.number().int().nonnegative().optional(),
  high_count: z.number().int().nonnegative().optional(),
  medium_count: z.number().int().nonnegative().optional(),
  low_count: z.number().int().nonnegative().optional(),
  info_count: z.number().int().nonnegative().optional(),
});

export type UpdateScanStatusDto = z.infer<typeof updateScanStatusSchema>;

// Vulnerability Schemas
export const createVulnerabilitySchema = z.object({
  scan_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string(),
  severity: z.enum(["critical", "high", "medium", "low", "info"]),
  cve_id: z.string().nullable().optional(),
  affected_component: z.string().max(300).nullable().optional(),
  remediation_steps: z.string().nullable().optional(),
  reference_urls: z.array(z.string().url()).nullable().optional(),
});

export type CreateVulnerabilityDto = z.infer<typeof createVulnerabilitySchema>;

// Notification Schemas
export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  message: z.string(),
  type: z.enum(["info", "warning", "error", "success"]),
  link: z.string().max(500).nullable().optional(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;

// File Upload Schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  bucket: z.enum(["scan-reports", "avatars"]),
  path: z.string().min(1).max(500),
});

export type FileUploadDto = z.infer<typeof fileUploadSchema>;

// Email Schemas
export const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  template: z.enum([
    "welcome",
    "scan-complete",
    "payment-success",
    "payment-failed",
    "subscription-cancelled",
    "vulnerability-alert",
  ]),
  data: z.record(z.any()),
});

export type SendEmailDto = z.infer<typeof sendEmailSchema>;

// Analytics Schemas
export const trackEventSchema = z.object({
  user_id: z.string().uuid(),
  event: z.string().min(1).max(100),
  properties: z.record(z.any()).optional(),
});

export type TrackEventDto = z.infer<typeof trackEventSchema>;

// ============= Response Types =============
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ScanStatistics {
  total_scans: number;
  completed_scans: number;
  pending_scans: number;
  failed_scans: number;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
}

export interface UsageMetrics {
  scans_count: number;
  scans_limit: number;
  storage_used: number;
  storage_limit: number;
  api_calls_count: number;
  api_calls_limit: number;
}

export interface StorageQuota {
  used: number;
  total: number;
  percentage: number;
  available: number;
}

// ============= Constants =============
export const SCAN_TYPES = ["full", "quick", "custom"] as const;
export const SEVERITY_LEVELS = ["critical", "high", "medium", "low", "info"] as const;
export const SCAN_STATUSES = ["pending", "running", "completed", "failed"] as const;
export const SUBSCRIPTION_TIERS = ["free", "starter", "pro", "enterprise"] as const;

// Tier limits
export const TIER_LIMITS = {
  free: {
    scans_per_month: 5,
    storage_mb: 100,
    api_calls_per_day: 100,
  },
  starter: {
    scans_per_month: 50,
    storage_mb: 1000,
    api_calls_per_day: 1000,
  },
  pro: {
    scans_per_month: 200,
    storage_mb: 5000,
    api_calls_per_day: 5000,
  },
  enterprise: {
    scans_per_month: -1, // unlimited
    storage_mb: -1, // unlimited
    api_calls_per_day: -1, // unlimited
  },
} as const;
