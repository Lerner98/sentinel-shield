import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user from auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { scan_name, target_url, scan_type } = body;

    // Input validation
    if (!scan_name || typeof scan_name !== 'string' || scan_name.trim().length === 0 || scan_name.length > 100) {
      return new Response(
        JSON.stringify({ error: "scan_name must be a non-empty string (max 100 characters)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!target_url || typeof target_url !== 'string' || target_url.length > 500) {
      return new Response(
        JSON.stringify({ error: "target_url must be a valid string (max 500 characters)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate URL format
    try {
      new URL(target_url);
    } catch {
      return new Response(
        JSON.stringify({ error: "target_url must be a valid URL" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const validScanTypes = ['full', 'quick', 'custom'];
    if (!scan_type || !validScanTypes.includes(scan_type)) {
      return new Response(
        JSON.stringify({ error: `scan_type must be one of: ${validScanTypes.join(', ')}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!scan_name || !target_url || !scan_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Initiating scan for user ${user.id}: ${scan_name}`);

    // Create scan record
    const { data: scan, error: scanError } = await supabaseClient
      .from("vulnerability_scans")
      .insert({
        user_id: user.id,
        scan_name,
        target_url,
        scan_type,
        status: "pending",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (scanError) {
      console.error("Error creating scan:", scanError);
      return new Response(
        JSON.stringify({ error: "Failed to create scan" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a real implementation, you would:
    // 1. Queue the scan job
    // 2. Call external scanning APIs
    // 3. Process results and store findings
    // 4. Update scan status to "completed"

    // For demo purposes, simulate scan completion after a delay
    setTimeout(async () => {
      // Simulate finding some vulnerabilities
      const mockFindings = [
        {
          scan_id: scan.id,
          title: "SQL Injection Vulnerability",
          description: "Potential SQL injection detected in login form",
          severity: "critical",
          cve_id: "CVE-2024-1234",
          affected_component: "login.php",
          remediation_steps:
            "Use parameterized queries instead of string concatenation",
          reference_urls: ["https://owasp.org/www-community/attacks/SQL_Injection"],
        },
        {
          scan_id: scan.id,
          title: "Cross-Site Scripting (XSS)",
          description: "Reflected XSS vulnerability in search parameter",
          severity: "high",
          cve_id: null,
          affected_component: "search.php",
          remediation_steps:
            "Implement proper input validation and output encoding",
          reference_urls: ["https://owasp.org/www-community/attacks/xss/"],
        },
      ];

      // Insert findings
      await supabaseClient
        .from("scan_findings")
        .insert(mockFindings);

      // Update scan status
      await supabaseClient
        .from("vulnerability_scans")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          total_vulnerabilities: 2,
          critical_count: 1,
          high_count: 1,
          medium_count: 0,
          low_count: 0,
          info_count: 0,
        })
        .eq("id", scan.id);

      console.log(`Scan ${scan.id} completed with 2 findings`);
    }, 5000); // Simulate 5 second scan

    return new Response(
      JSON.stringify({
        success: true,
        scan_id: scan.id,
        message: "Scan initiated successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in initiate-scan function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
