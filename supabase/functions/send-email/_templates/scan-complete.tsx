import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from "https://esm.sh/@react-email/components@0.0.22";
import * as React from "https://esm.sh/react@18.3.1";

interface ScanCompleteEmailProps {
  scanName: string;
  targetUrl: string;
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  dashboardUrl: string;
}

export const ScanCompleteEmail = ({
  scanName,
  targetUrl,
  totalVulnerabilities,
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
  dashboardUrl,
}: ScanCompleteEmailProps) => (
  <Html>
    <Head />
    <Preview>{`Your vulnerability scan is complete - ${totalVulnerabilities} issues found`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Scan Complete ✅</Heading>
        
        <Text style={text}>
          Your vulnerability scan <strong>{scanName}</strong> for{" "}
          <code style={code}>{targetUrl}</code> has completed successfully.
        </Text>

        <Section style={resultsSection}>
          <Heading style={h2}>Scan Results</Heading>
          
          <div style={statsGrid}>
            <div style={statBox}>
              <Text style={statNumber}>{totalVulnerabilities}</Text>
              <Text style={statLabel}>Total Issues</Text>
            </div>
          </div>

          <div style={severityBreakdown}>
            {criticalCount > 0 && (
              <div style={severityRow}>
                <span style={{ ...severityBadge, ...criticalBadge }}>Critical</span>
                <span style={severityCount}>{criticalCount}</span>
              </div>
            )}
            {highCount > 0 && (
              <div style={severityRow}>
                <span style={{ ...severityBadge, ...highBadge }}>High</span>
                <span style={severityCount}>{highCount}</span>
              </div>
            )}
            {mediumCount > 0 && (
              <div style={severityRow}>
                <span style={{ ...severityBadge, ...mediumBadge }}>Medium</span>
                <span style={severityCount}>{mediumCount}</span>
              </div>
            )}
            {lowCount > 0 && (
              <div style={severityRow}>
                <span style={{ ...severityBadge, ...lowBadge }}>Low</span>
                <span style={severityCount}>{lowCount}</span>
              </div>
            )}
          </div>
        </Section>

        {criticalCount > 0 && (
          <Section style={warningSection}>
            <Text style={warningText}>
              ⚠️ Critical vulnerabilities require immediate attention
            </Text>
          </Section>
        )}

        <Link href={dashboardUrl} style={button}>
          View Full Report
        </Link>

        <Text style={text}>
          Review the detailed findings and recommended remediation steps in your dashboard.
        </Text>

        <Text style={footer}>
          VulnScanner - Securing the web, one scan at a time
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ScanCompleteEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const code = {
  backgroundColor: "#f4f4f4",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: "monospace",
};

const resultsSection = {
  padding: "24px 40px",
  backgroundColor: "#f8f9fa",
  margin: "24px 0",
};

const statsGrid = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const statBox = {
  display: "inline-block",
  padding: "16px",
};

const statNumber = {
  fontSize: "48px",
  fontWeight: "bold",
  color: "#6366f1",
  margin: 0,
};

const statLabel = {
  fontSize: "14px",
  color: "#666",
  margin: "8px 0 0 0",
};

const severityBreakdown = {
  marginTop: "24px",
};

const severityRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #e0e0e0",
};

const severityBadge = {
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "bold",
};

const criticalBadge = {
  backgroundColor: "#dc2626",
  color: "#fff",
};

const highBadge = {
  backgroundColor: "#ea580c",
  color: "#fff",
};

const mediumBadge = {
  backgroundColor: "#f59e0b",
  color: "#fff",
};

const lowBadge = {
  backgroundColor: "#84cc16",
  color: "#fff",
};

const severityCount = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333",
};

const warningSection = {
  backgroundColor: "#fef2f2",
  padding: "16px 40px",
  margin: "24px 0",
  borderLeft: "4px solid #dc2626",
};

const warningText = {
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "bold",
  margin: 0,
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "14px 20px",
  margin: "32px auto",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 40px",
  marginTop: "32px",
  textAlign: "center" as const,
};
