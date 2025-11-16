import { Shield, Zap, Lock, Eye, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Automated Scanning",
    description: "Continuous vulnerability detection across your entire infrastructure with zero configuration required.",
  },
  {
    icon: Zap,
    title: "Real-Time Alerts",
    description: "Instant notifications when threats are detected, with detailed remediation guidance.",
  },
  {
    icon: Lock,
    title: "Compliance Ready",
    description: "Meet SOC 2, GDPR, and ISO 27001 requirements with automated compliance reporting.",
  },
  {
    icon: Eye,
    title: "Visual Dashboards",
    description: "Track vulnerabilities, trends, and remediation progress with intuitive analytics.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Remediation",
    description: "AI-powered suggestions and one-click fixes for common security issues.",
  },
  {
    icon: TrendingUp,
    title: "Risk Scoring",
    description: "Prioritize threats with intelligent risk assessment based on your environment.",
  },
];

export const Features = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 md:py-20 lg:py-28 relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            Enterprise Security,{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to protect your organization from cyber threats
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-card/70 hover:border-primary/30 hover:shadow-lg hover:scale-105"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-neutral-950 transition-all duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">
            Learn More About Our Services
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/services/vulnerability-scanning")}
              className="border-primary/50 hover:bg-primary/10"
            >
              Vulnerability Scanning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/services/integration")}
              className="border-primary/50 hover:bg-primary/10"
            >
              Integration Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
