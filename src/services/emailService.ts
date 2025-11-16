import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./types";

interface SendEmailDto {
  type: "welcome" | "scan_complete" | "subscription_cancelled";
  to: string;
  data?: any;
}

interface ScanCompleteEmailData {
  scan_name: string;
  target_url: string;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  dashboard_url: string;
}

export const emailService = {
  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(
    email: string,
    tier: string
  ): Promise<ApiResponse<void>> {
    return this.sendEmail({
      type: "welcome",
      to: email,
      data: { tier },
    });
  },

  /**
   * Send scan complete notification
   */
  async sendScanCompleteEmail(
    email: string,
    scanData: ScanCompleteEmailData
  ): Promise<ApiResponse<void>> {
    return this.sendEmail({
      type: "scan_complete",
      to: email,
      data: scanData,
    });
  },

  /**
   * Send subscription cancelled notification
   */
  async sendSubscriptionCancelledEmail(
    email: string
  ): Promise<ApiResponse<void>> {
    return this.sendEmail({
      type: "subscription_cancelled",
      to: email,
    });
  },

  /**
   * Generic email sending function
   */
  async sendEmail(dto: SendEmailDto): Promise<ApiResponse<void>> {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: dto,
      });

      if (error) throw error;

      return { data: undefined };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        error: {
          message: "Failed to send email",
          code: (error as any)?.code,
        },
      };
    }
  },
};
