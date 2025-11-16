import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { trackPageView, trackEvent } from "@/lib/analytics/tracker";

/**
 * Auto-track page views whenever the route changes
 */
export function usePageTracking() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      trackPageView(user.id, location.pathname);
    }
  }, [location.pathname, user]);
}

/**
 * Hook to manually track custom events
 */
export function useTrackEvent() {
  const { user } = useAuth();

  return (event: string, properties?: Record<string, any>) => {
    if (user) {
      trackEvent(user.id, event, properties);
    }
  };
}
