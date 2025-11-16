import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.22";
import React from "https://esm.sh/react@18.3.1";
import { WelcomeEmail } from "./_templates/welcome.tsx";
import { ScanCompleteEmail } from "./_templates/scan-complete.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "noreply@yourdomain.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "welcome" | "scan_complete" | "subscription_cancelled";
  to: string;
  data?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    let html: string;
    let subject: string;

    switch (type) {
      case "welcome":
        subject = "Welcome to VulnScanner!";
        html = await renderAsync(
          React.createElement(WelcomeEmail, {
            tier: data?.tier || "free",
          })
        );
        break;

      case "scan_complete":
        subject = `Scan Complete: ${data?.scan_name || "Your Scan"}`;
        html = await renderAsync(
          React.createElement(ScanCompleteEmail, {
            scanName: data?.scan_name,
            targetUrl: data?.target_url,
            totalVulnerabilities: data?.total_vulnerabilities,
            criticalCount: data?.critical_count,
            highCount: data?.high_count,
            mediumCount: data?.medium_count,
            lowCount: data?.low_count,
            dashboardUrl: data?.dashboard_url,
          })
        );
        break;

      case "subscription_cancelled":
        subject = "Subscription Cancelled";
        html = `
          <h1>Your subscription has been cancelled</h1>
          <p>We're sorry to see you go. Your subscription will remain active until the end of your billing period.</p>
          <p>You can resubscribe anytime from your dashboard.</p>
        `;
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
