import { supabase } from "@/integrations/supabase/client";
import {
  VulnerabilityScan,
  CreateScanDto,
  UpdateScanStatusDto,
  ScanStatistics,
  ApiResponse,
} from "./types";

export const scanService = {
  /**
   * Get all scans for a user with pagination
   */
  async getAll(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<VulnerabilityScan[]>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("vulnerability_scans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { data: data || [] };
    } catch (error) {
      console.error("Error fetching scans:", error);
      return {
        error: {
          message: "Failed to fetch scans",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Get a single scan by ID
   */
  async getById(scanId: string): Promise<ApiResponse<VulnerabilityScan>> {
    try {
      const { data, error } = await supabase
        .from("vulnerability_scans")
        .select("*")
        .eq("id", scanId)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error fetching scan:", error);
      return {
        error: {
          message: "Failed to fetch scan",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Create a new scan
   */
  async create(
    userId: string,
    dto: CreateScanDto
  ): Promise<ApiResponse<VulnerabilityScan>> {
    try {
      const { data, error } = await supabase
        .from("vulnerability_scans")
        .insert({
          user_id: userId,
          scan_name: dto.scan_name,
          target_url: dto.target_url,
          scan_type: dto.scan_type,
          status: "pending",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error creating scan:", error);
      return {
        error: {
          message: "Failed to create scan",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Update scan status and progress
   */
  async updateStatus(
    scanId: string,
    dto: UpdateScanStatusDto
  ): Promise<ApiResponse<VulnerabilityScan>> {
    try {
      const updateData: any = {
        status: dto.status,
        updated_at: new Date().toISOString(),
      };

      if (dto.status === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      if (dto.total_vulnerabilities !== undefined) {
        updateData.total_vulnerabilities = dto.total_vulnerabilities;
        updateData.critical_count = dto.critical_count || 0;
        updateData.high_count = dto.high_count || 0;
        updateData.medium_count = dto.medium_count || 0;
        updateData.low_count = dto.low_count || 0;
        updateData.info_count = dto.info_count || 0;
      }

      const { data, error } = await supabase
        .from("vulnerability_scans")
        .update(updateData)
        .eq("id", scanId)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error updating scan:", error);
      return {
        error: {
          message: "Failed to update scan",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Delete a scan
   */
  async delete(scanId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from("vulnerability_scans")
        .delete()
        .eq("id", scanId);

      if (error) throw error;

      return { data: undefined };
    } catch (error) {
      console.error("Error deleting scan:", error);
      return {
        error: {
          message: "Failed to delete scan",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Get scan statistics for a user
   */
  async getStatistics(userId: string): Promise<ApiResponse<ScanStatistics>> {
    try {
      const { data, error } = await supabase
        .from("vulnerability_scans")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const scans = data || [];
      const statistics: ScanStatistics = {
        total_scans: scans.length,
        completed_scans: scans.filter((s) => s.status === "completed").length,
        pending_scans: scans.filter(
          (s) => s.status === "pending" || s.status === "running"
        ).length,
        failed_scans: scans.filter((s) => s.status === "failed").length,
        total_vulnerabilities: scans.reduce(
          (sum, s) => sum + (s.total_vulnerabilities || 0),
          0
        ),
        critical_count: scans.reduce((sum, s) => sum + (s.critical_count || 0), 0),
        high_count: scans.reduce((sum, s) => sum + (s.high_count || 0), 0),
        medium_count: scans.reduce((sum, s) => sum + (s.medium_count || 0), 0),
        low_count: scans.reduce((sum, s) => sum + (s.low_count || 0), 0),
        info_count: scans.reduce((sum, s) => sum + (s.info_count || 0), 0),
      };

      return { data: statistics };
    } catch (error) {
      console.error("Error fetching scan statistics:", error);
      return {
        error: {
          message: "Failed to fetch statistics",
          code: (error as any)?.code,
        },
      };
    }
  },

  /**
   * Export scan results
   */
  async exportResults(
    scanId: string,
    format: "pdf" | "csv" | "json"
  ): Promise<ApiResponse<Blob>> {
    try {
      // This would be implemented with an edge function
      const { data, error } = await supabase.functions.invoke("export-scan", {
        body: { scanId, format },
      });

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error("Error exporting scan:", error);
      return {
        error: {
          message: "Failed to export scan",
          code: (error as any)?.code,
        },
      };
    }
  },
};
