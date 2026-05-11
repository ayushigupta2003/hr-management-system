import { ShieldOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-red-50 text-red-500 shadow-card">
        <ShieldOff className="h-9 w-9" />
      </div>
      <h1 className="text-2xl font-bold text-ink">Access Denied</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        You don't have permission to view this page. Contact your administrator if you think this is a mistake.
      </p>
      <Button as={Link} to="/dashboard" variant="secondary" className="mt-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </div>
  );
}
