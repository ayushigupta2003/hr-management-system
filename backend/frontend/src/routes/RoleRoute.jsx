import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

/**
 * Restricts a route to users with one of the allowed roles.
 * Usage: <RoleRoute roles={['admin', 'hr']} />
 */
export function RoleRoute({ roles }) {
  const location = useLocation();
  const { hasRole } = useRole();

  if (!hasRole(...roles)) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
