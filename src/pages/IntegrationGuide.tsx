import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Terminal,
  Webhook,
  Key,
  PlayCircle,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const IntegrationGuide = () => {
  const navigate = useNavigate();

  const integrationMethods = [
    {
      icon: Terminal,
      title: "REST API",
      description: "Direct API access for custom integrations",
      link: "#api",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Real-time notifications for scan events",
      link: "#webhooks",
    },
    {
      icon: Code,
      title: "SDKs",
      description: "Official libraries for popular languages",
      link: "#sdks",
    },
  ];

  const apiExample = `// Initialize the client
import { VulnScanClient } from '@vulnscan/sdk';

const client = new VulnScanClient({
  apiKey: process.env.VULNSCAN_API_KEY
});

// Start a scan
const scan = await client.scans.create({
  name: 'Production API Scan',
  targetUrl: 'https://api.example.com',
  scanType: 'full'
});

// Get scan results
const results = await client.scans.getResults(scan.id);
console.log(\`Found \${results.totalVulnerabilities} vulnerabilities\`);`;

  const webhookExample = `// Express.js webhook handler
app.post('/webhooks/vulnscan', async (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'scan.completed':
      console.log('Scan completed:', data.scanId);
      // Send notification to team
      await notifyTeam(data);
      break;
      
    case 'vulnerability.critical':
      console.log('Critical vulnerability found!');
      // Trigger incident response
      await triggerIncident(data);
      break;
  }
  
  res.status(200).json({ received: true });
});`;

  const cicdExample = `# GitHub Actions Integration
name: Security Scan
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run Vulnerability Scan
        uses: vulnscan/scan-action@v1
        with:
          api-key: \${{ secrets.VULNSCAN_API_KEY }}
          target-url: \${{ secrets.STAGING_URL }}
          
      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: scan-results
          path: ./scan-report.json`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Code className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Integration{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Documentation
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Seamlessly integrate security scanning into your development workflow.
                Multiple integration methods to fit your tech stack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-primary hover:bg-primary/90 text-neutral-950"
                >
                  Get API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Full Docs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Methods */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Choose Your Integration Method
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {integrationMethods.map((method, index) => (
                <Card
                  key={index}
                  className="border-border/50 bg-card/50 hover:bg-card transition-colors cursor-pointer"
                  onClick={() => {
                    const element = document.querySelector(method.link);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-16 px-4" id="examples">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Quick Start Examples
            </h2>
            
            <Tabs defaultValue="api" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
                <TabsTrigger value="api">REST API</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="cicd">CI/CD</TabsTrigger>
              </TabsList>
              
              <TabsContent value="api" id="api">
                <Card>
                  <CardHeader>
                    <CardTitle>REST API Integration</CardTitle>
                    <CardDescription>
                      Use our REST API to programmatically manage scans and retrieve results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-6 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="text-foreground">{apiExample}</code>
                      </pre>
                    </div>
                    <div className="mt-6 space-y-3">
                      <FeatureItem text="RESTful endpoints for all operations" />
                      <FeatureItem text="Comprehensive error handling" />
                      <FeatureItem text="Rate limiting and authentication" />
                      <FeatureItem text="Detailed API documentation" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="webhooks" id="webhooks">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook Integration</CardTitle>
                    <CardDescription>
                      Receive real-time notifications for scan events and vulnerabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-6 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="text-foreground">{webhookExample}</code>
                      </pre>
                    </div>
                    <div className="mt-6 space-y-3">
                      <FeatureItem text="Real-time event notifications" />
                      <FeatureItem text="Customizable event filters" />
                      <FeatureItem text="Secure webhook signatures" />
                      <FeatureItem text="Retry logic for failed deliveries" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cicd">
                <Card>
                  <CardHeader>
                    <CardTitle>CI/CD Integration</CardTitle>
                    <CardDescription>
                      Automate security scanning in your deployment pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-6 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="text-foreground">{cicdExample}</code>
                      </pre>
                    </div>
                    <div className="mt-6 space-y-3">
                      <FeatureItem text="GitHub Actions, GitLab CI, Jenkins support" />
                      <FeatureItem text="Fail builds on critical vulnerabilities" />
                      <FeatureItem text="Automated reporting and notifications" />
                      <FeatureItem text="Shift-left security testing" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-16 px-4 bg-muted/30" id="sdks">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Official SDKs
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Node.js / TypeScript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-muted/50 px-3 py-2 rounded block mb-4">
                    npm install @vulnscan/sdk
                  </code>
                  <Button variant="outline" size="sm" className="w-full">
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Python
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-muted/50 px-3 py-2 rounded block mb-4">
                    pip install vulnscan
                  </code>
                  <Button variant="outline" size="sm" className="w-full">
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Integrate?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get your API key and start securing your applications in minutes
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90 text-neutral-950"
            >
              <Key className="mr-2 h-4 w-4" />
              Get API Access
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
    <span className="text-sm text-foreground">{text}</span>
  </div>
);

export default IntegrationGuide;
