import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { AttendancePage } from '../features/attendance/pages/AttendancePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ProfilePage } from '../features/auth/pages/ProfilePage';
import { DepartmentsPage } from '../features/departments/pages/DepartmentsPage';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { RecruitmentPage } from '../features/recruitment/pages/RecruitmentPage';
import { PerformancePage } from '../features/performance/pages/PerformancePage';
import { DocumentsPage } from '../features/documents/pages/DocumentsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <LoginPage />    },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard',    element: <DashboardPage />    },
          { path: '/profile',      element: <ProfilePage />      },
          { path: '/unauthorized', element: <UnauthorizedPage /> },
          {
            element: <RoleRoute roles={['admin', 'hr']} />,
            children: [
              { path: '/employees',   element: <EmployeesPage />   },
              { path: '/departments', element: <DepartmentsPage /> },
              { path: '/attendance',  element: <AttendancePage />  },
              { path: '/recruitment', element: <RecruitmentPage /> },
              { path: '/performance', element: <PerformancePage /> },
              { path: '/documents',   element: <DocumentsPage />   },
            ],
          },
        ],
      },
    ],
  },
  { path: '/',  element: <Navigate to="/dashboard" replace /> },
  { path: '*',  element: <Navigate to="/dashboard" replace /> },
]);
