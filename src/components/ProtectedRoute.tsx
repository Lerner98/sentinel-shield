import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GLOBAL_STYLES } from "@/lib/globals";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={GLOBAL_STYLES.loading.spinner} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
