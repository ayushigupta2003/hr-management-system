import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ChevronRight,
  UserCircle,
  Briefcase,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '../components/common/Button';
import { NotificationBell } from '../components/common/NotificationBell';
import { APP_ROUTES } from '../constants/appRoutes';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { logout } from '../features/auth/store/authSlice';

const ALL_NAV = [
  { label: 'Dashboard',   to: APP_ROUTES.dashboard,   icon: LayoutDashboard, adminOnly: false },
  { label: 'Employees',   to: APP_ROUTES.employees,   icon: Users,           adminOnly: true  },
  { label: 'Departments', to: APP_ROUTES.departments, icon: Building2,       adminOnly: true  },
  { label: 'Attendance',  to: APP_ROUTES.attendance,  icon: CalendarDays,    adminOnly: true  },
  { label: 'Recruitment', to: APP_ROUTES.recruitment, icon: Briefcase,       adminOnly: true  },
  { label: 'Performance', to: APP_ROUTES.performance, icon: TrendingUp,      adminOnly: true  },
  { label: 'Documents',   to: APP_ROUTES.documents,   icon: FileCheck,       adminOnly: true  },
];

function NavItem({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          isActive
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-ink'}`} />
          <span className="flex-1">{item.label}</span>
          {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
        </>
      )}
    </NavLink>
  );
}

export function AppLayout() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { isAdminOrHR } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = ALL_NAV.filter((item) => !item.adminOnly || isAdminOrHR);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const roleColors = {
    admin: 'from-brand-500 to-brand-700',
    hr: 'from-violet-500 to-violet-700',
    employee: 'from-sky-500 to-sky-700',
  };
  const avatarGradient = roleColors[user?.role] ?? roleColors.employee;

  const Sidebar = ({ onClose }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
          <Users className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-ink leading-tight">HRMS</p>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-ink lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 grid gap-1 content-start">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* User card */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${avatarGradient} text-xs font-bold text-white shadow-sm`}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.name ?? 'User'}</p>
            <p className="truncate text-xs capitalize text-slate-400">{user?.role ?? 'employee'}</p>
          </div>
          <Link
            to="/profile"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            aria-label="Profile"
            title="My Profile"
          >
            <UserCircle className="h-4 w-4" />
          </Link>
          <button
            onClick={() => dispatch(logout())}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4f9]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 border-r border-slate-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-soft animate-slide-up">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Top bar (mobile only) */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
            <Users className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-sm font-bold text-ink">HRMS</p>
          <div className="ml-auto">
            <NotificationBell />
          </div>
        </header>

        {/* Desktop top bar — notifications only */}
        <header className="hidden lg:flex h-14 items-center justify-end border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md sticky top-0 z-10">
          <NotificationBell />
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
