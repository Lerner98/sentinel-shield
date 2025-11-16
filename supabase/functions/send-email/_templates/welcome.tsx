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

interface WelcomeEmailProps {
  tier: string;
}

export const WelcomeEmail = ({ tier }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to VulnScanner - Start securing your applications</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to VulnScanner! 🎉</Heading>
        
        <Text style={text}>
          Thank you for joining VulnScanner. We're excited to help you secure your applications
          with our comprehensive vulnerability scanning platform.
        </Text>

        <Section style={tierSection}>
          <Text style={tierText}>
            Your Plan: <strong style={tierBadge}>{tier.toUpperCase()}</strong>
          </Text>
        </Section>

        <Text style={text}>
          Here's what you can do next:
        </Text>

        <ul style={list}>
          <li style={listItem}>Run your first vulnerability scan</li>
          <li style={listItem}>Explore our comprehensive reporting features</li>
          <li style={listItem}>Set up automated scanning schedules</li>
          <li style={listItem}>Integrate with your CI/CD pipeline</li>
        </ul>

        <Link
          href={`${Deno.env.get("VITE_APP_URL") || "https://your-app.lovable.app"}/dashboard`}
          style={button}
        >
          Go to Dashboard
        </Link>

        <Text style={text}>
          Need help getting started? Check out our{" "}
          <Link href="#" style={link}>
            documentation
          </Link>{" "}
          or reach out to our support team.
        </Text>

        <Text style={footer}>
          VulnScanner - Securing the web, one scan at a time
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const tierSection = {
  padding: "24px 40px",
  backgroundColor: "#f8f9fa",
  margin: "24px 0",
};

const tierText = {
  color: "#333",
  fontSize: "16px",
  margin: 0,
};

const tierBadge = {
  color: "#6366f1",
  fontSize: "18px",
};

const list = {
  paddingLeft: "60px",
  margin: "24px 0",
};

const listItem = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "8px",
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

const link = {
  color: "#6366f1",
  textDecoration: "underline",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 40px",
  marginTop: "32px",
  textAlign: "center" as const,
};
