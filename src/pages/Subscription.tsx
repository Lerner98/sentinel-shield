import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { stripeService } from "@/services/stripeService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, isLoading } = useSubscription();
  const { toast } = useToast();
  const [canceling, setCanceling] = useState(false);
  const [managingBilling, setManagingBilling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleManageBilling = async () => {
    if (!subscription?.stripe_customer_id) {
      toast({
        title: "No billing account",
        description: "You don't have an active subscription to manage.",
        variant: "destructive",
      });
      return;
    }

    setManagingBilling(true);
    const result = await stripeService.createPortalSession(
      subscription.stripe_customer_id
    );

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
      setManagingBilling(false);
      return;
    }

    if (result.data?.url) {
      window.location.href = result.data.url;
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    setCanceling(true);
    const result = await stripeService.cancelSubscription(
      subscription.stripe_subscription_id
    );

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription will end at the end of the billing period.",
      });
    }

    setCanceling(false);
  };

  const tierColors = {
    free: "bg-muted text-muted-foreground",
    professional: "bg-primary/10 text-primary",
    enterprise: "bg-secondary/10 text-secondary",
  };

  const statusColors = {
    active: "bg-green-500/10 text-green-500",
    canceled: "bg-red-500/10 text-red-500",
    past_due: "bg-yellow-500/10 text-yellow-500",
    trialing: "bg-blue-500/10 text-blue-500",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Subscription Management
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription and billing settings
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <div className="flex gap-2">
                  <Badge className={tierColors[subscription?.tier || "free"]}>
                    {subscription?.tier?.toUpperCase() || "FREE"}
                  </Badge>
                  <Badge className={statusColors[subscription?.status || "trialing"]}>
                    {subscription?.status?.toUpperCase() || "TRIALING"}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                {subscription?.tier === "free"
                  ? "You're on the free plan with limited features"
                  : "You have access to all premium features"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription?.current_period_start && subscription?.current_period_end && (
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Billing Period</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(subscription.current_period_start).toLocaleDateString()} -{" "}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {subscription?.cancel_at_period_end && (
                <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <XCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-yellow-600 dark:text-yellow-500">
                      Subscription Ending
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your subscription will end on{" "}
                      {subscription.current_period_end &&
                        new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {subscription?.status === "active" && !subscription?.cancel_at_period_end && (
                <div className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-green-600 dark:text-green-500">
                      Active Subscription
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your subscription is active and will renew automatically
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {subscription?.tier !== "free" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleManageBilling}
                      disabled={managingBilling}
                      className="flex-1"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {managingBilling ? "Loading..." : "Manage Billing"}
                    </Button>

                    {!subscription?.cancel_at_period_end && (
                      <Button
                        variant="destructive"
                        onClick={handleCancelSubscription}
                        disabled={canceling}
                        className="flex-1"
                      >
                        {canceling ? "Canceling..." : "Cancel Subscription"}
                      </Button>
                    )}
                  </>
                )}

                {subscription?.tier === "free" && (
                  <Button
                    onClick={() => navigate("/#pricing")}
                    className="w-full"
                  >
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>
                Features available in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscription?.tier === "free" && (
                  <>
                    <FeatureItem text="5 scans per month" />
                    <FeatureItem text="Basic vulnerability detection" />
                    <FeatureItem text="Email support" />
                  </>
                )}
                {subscription?.tier === "professional" && (
                  <>
                    <FeatureItem text="Up to 100 assets" />
                    <FeatureItem text="Daily scans" />
                    <FeatureItem text="Advanced threat detection" />
                    <FeatureItem text="Priority support" />
                    <FeatureItem text="Custom integrations" />
                    <FeatureItem text="Auto-remediation" />
                  </>
                )}
                {subscription?.tier === "enterprise" && (
                  <>
                    <FeatureItem text="Unlimited assets" />
                    <FeatureItem text="Real-time scanning" />
                    <FeatureItem text="AI-powered detection" />
                    <FeatureItem text="24/7 dedicated support" />
                    <FeatureItem text="Custom workflows" />
                    <FeatureItem text="Advanced analytics" />
                    <FeatureItem text="White-label options" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
    <span className="text-sm text-foreground">{text}</span>
  </div>
);

export default Subscription;
