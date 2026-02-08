import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Admin users should only access admin routes
  if (user && user.role === 'admin' && !requireAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Non-admin users trying to access admin routes
  if (requireAdmin && !isAdmin) {
    // Redirect admin to admin panel, normal users to dashboard
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
