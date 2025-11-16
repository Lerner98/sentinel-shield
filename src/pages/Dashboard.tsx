import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GLOBAL_STYLES } from "@/lib/globals";
import { Shield, AlertTriangle, CheckCircle, Clock, LogOut } from "lucide-react";

interface Subscription {
  tier: string;
  status: string;
}

interface VulnerabilityScan {
  id: string;
  scan_name: string;
  target_url: string;
  status: string;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [scans, setScans] = useState<VulnerabilityScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("tier, status")
        .eq("user_id", user.id)
        .single();

      if (subData) setSubscription(subData);

      // Load recent scans
      const { data: scansData } = await supabase
        .from("vulnerability_scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (scansData) setScans(scansData);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; icon: any }> = {
      completed: { variant: "success", icon: CheckCircle },
      running: { variant: "default", icon: Clock },
      pending: { variant: "secondary", icon: Clock },
      failed: { variant: "destructive", icon: AlertTriangle },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={GLOBAL_STYLES.loading.spinner} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className={GLOBAL_STYLES.text.h3}>CyberDefense Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={GLOBAL_STYLES.text.small}>{user?.email}</p>
              {subscription && (
                <Badge variant="outline" className="capitalize">
                  {subscription.tier} Plan
                </Badge>
              )}
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={GLOBAL_STYLES.cards.base}>
            <div className="p-6">
              <p className="text-muted-foreground text-sm">Total Scans</p>
              <p className={`${GLOBAL_STYLES.text.h2} text-primary`}>{scans.length}</p>
            </div>
          </Card>
          <Card className={GLOBAL_STYLES.cards.base}>
            <div className="p-6">
              <p className="text-muted-foreground text-sm">Critical Issues</p>
              <p className={`${GLOBAL_STYLES.text.h2} text-destructive`}>
                {scans.reduce((sum, scan) => sum + scan.critical_count, 0)}
              </p>
            </div>
          </Card>
          <Card className={GLOBAL_STYLES.cards.base}>
            <div className="p-6">
              <p className="text-muted-foreground text-sm">High Priority</p>
              <p className={`${GLOBAL_STYLES.text.h2} text-accent`}>
                {scans.reduce((sum, scan) => sum + scan.high_count, 0)}
              </p>
            </div>
          </Card>
          <Card className={GLOBAL_STYLES.cards.base}>
            <div className="p-6">
              <p className="text-muted-foreground text-sm">Subscription</p>
              <p className={`${GLOBAL_STYLES.text.h2} capitalize`}>
                {subscription?.tier || "Free"}
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card className={GLOBAL_STYLES.cards.variants.solid}>
          <div className="p-6 border-b border-border">
            <h2 className={GLOBAL_STYLES.text.h3}>Recent Vulnerability Scans</h2>
          </div>
          <div className="p-6">
            {scans.length === 0 ? (
              <div className={GLOBAL_STYLES.empty.container}>
                <Shield className="w-16 h-16 text-primary/30" />
                <p className={GLOBAL_STYLES.text.h4}>No scans yet</p>
                <p className={GLOBAL_STYLES.empty.description}>
                  Start your first vulnerability scan to protect your systems
                </p>
                <Button className={GLOBAL_STYLES.buttons.variants.primary}>
                  Start New Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className={GLOBAL_STYLES.text.body}>{scan.scan_name}</h3>
                      <p className={GLOBAL_STYLES.text.small}>{scan.target_url}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="destructive" className="text-xs">
                          {scan.critical_count} Critical
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {scan.high_count} High
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {scan.medium_count} Medium
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(scan.status)}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
