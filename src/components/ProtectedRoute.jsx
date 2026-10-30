import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Spinner = () => (
  <div className="spinner-wrap" style={{ minHeight: '100vh' }}>
    <div className="spinner" />
    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Loading…</p>
  </div>
);

/**
 * Protects a route.
 * @param {string} role - 'student' | 'admin' | undefined (any authenticated)
 */
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, isAdmin, isStudent, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!isAuthenticated) {
    const loginPath = role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'student' && !isStudent) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
