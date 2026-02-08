import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/store/store";
import type { UserRole } from "@/types/index";
import { Loader2 } from "lucide-react";

// ============================================
// AUTH LOADING SCREEN
// ============================================

function AuthLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// ============================================
// PROTECTED ROUTE - Requires authentication
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );

  // Show loading while auth state is being determined
  if (isLoading) {
    return <AuthLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}

// ============================================
// PUBLIC ONLY ROUTE - Redirects if authenticated
// ============================================

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicOnlyRoute({
  children,
  redirectTo = "/dashboard",
}: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    // Redirect based on role
    const redirect =
      user?.role === "admin" ? "/admin" : redirectTo;
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}

// ============================================
// CUSTOMER ROUTE - Only for customers
// ============================================

interface CustomerRouteProps {
  children: React.ReactNode;
}

export function CustomerRoute({ children }: CustomerRouteProps) {
  return (
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}

// ============================================
// ADMIN ROUTE - Only for admins
// ============================================

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}
