import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small teams getting started with security",
    features: [
      "Up to 10 assets",
      "Weekly scans",
      "Basic vulnerability detection",
      "Email support",
      "Compliance reports",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "For growing companies with advanced security needs",
    features: [
      "Up to 100 assets",
      "Daily scans",
      "Advanced threat detection",
      "Priority support",
      "Custom integrations",
      "Auto-remediation",
      "Risk scoring",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited assets",
      "Real-time scanning",
      "AI-powered detection",
      "24/7 dedicated support",
      "Custom workflows",
      "Advanced analytics",
      "White-label options",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-12 md:py-20 lg:py-28 relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your organization's security needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative rounded-xl border p-8 transition-all duration-300
                ${plan.popular 
                  ? 'border-primary/50 bg-card/70 shadow-[0_0_40px_hsl(188_100%_50%/0.2)] scale-105' 
                  : 'border-border/50 bg-card/50 hover:bg-card/70 hover:border-primary/30'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-neutral-950 text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-lg">{plan.period}</span>
              </div>
              
              <Button 
                className={`
                  w-full h-12 mb-8
                  ${plan.popular 
                    ? 'bg-primary text-neutral-950 hover:bg-primary/90 hover:shadow-[0_0_40px_hsl(188_100%_50%/0.5)]' 
                    : 'border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(188_100%_50%/0.3)]'
                  }
                  active:scale-95 transition-all
                `}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
