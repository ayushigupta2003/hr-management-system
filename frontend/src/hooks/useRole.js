import { useAuth } from './useAuth';

export const ROLES = {
  Admin: 'admin',
  HR: 'hr',
  Employee: 'employee',
};

export function useRole() {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    isAdmin: role === ROLES.Admin,
    isHR: role === ROLES.HR,
    isEmployee: role === ROLES.Employee,
    isAdminOrHR: role === ROLES.Admin || role === ROLES.HR,
    hasRole: (...roles) => roles.includes(role),
  };
}
