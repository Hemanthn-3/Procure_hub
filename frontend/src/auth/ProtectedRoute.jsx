import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute — Gateway component that checks user role and token
 * @param {string[]} allowedRoles - Array of allowed roles (e.g., ['procurement_manager'])
 * @param {React.ReactNode} children - Child components to render if authorized
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg"></div>
        <span>Authenticating...</span>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'procurement_manager') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}
