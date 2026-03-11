import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "@/lib/demoAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  variant?: "mobile" | "web";
}

/**
 * Protected Route Component
 * 
 * Requires user to be logged in to access.
 * Redirects to auth page if not logged in.
 */
export default function ProtectedRoute({ children, variant = "mobile" }: ProtectedRouteProps) {
  const location = useLocation();
  
  // Check if user is logged in
  if (!isLoggedIn()) {
    // Redirect to auth page with return URL
    const authPath = variant === "mobile" ? "/m/auth" : "/app/auth";
    const redirectUrl = `${authPath}?mode=login&redirect=${encodeURIComponent(location.pathname)}`;
    
    console.log('🔒 Access denied - redirecting to login:', location.pathname);
    return <Navigate to={redirectUrl} replace />;
  }

  // User is logged in - render protected content
  return <>{children}</>;
}
