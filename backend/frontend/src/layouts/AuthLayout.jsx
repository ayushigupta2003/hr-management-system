import { Users } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-tight">HR Management</p>
            <p className="text-xs text-white/60">System</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-soft">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
