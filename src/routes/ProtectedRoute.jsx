import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { user, userProfile, loading, isAdmin } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check role-based access if requireRole is specified
  // Admin users have unrestricted access to all routes
  // Boarding owners have access to all routes except admin dashboard
  if (requireRole) {
    // Admin users have unrestricted access to all routes
    if (isAdmin()) {
      return children;
    }
    
    // Check if user has the required role
    if (userProfile?.role === requireRole || userProfile?.userType === requireRole) {
      return children;
    }
    
    // Special case: boarding owners should not access admin routes
    if (requireRole === "admin") {
      return <Navigate to="/" />;
    }
    
    // For all other routes, boarding owners have full access
    if (userProfile?.role === "boarding_owner" || userProfile?.userType === "boarding_owner") {
      return children;
    }
    
    // If user doesn't have the required role and is not a boarding owner, deny access
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
