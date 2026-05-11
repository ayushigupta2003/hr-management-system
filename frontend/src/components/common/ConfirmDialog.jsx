import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

/**
 * Confirmation dialog for destructive actions.
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null);
 *   <ConfirmDialog
 *     isOpen={!!confirm}
 *     title="Delete Employee"
 *     message="This action cannot be undone."
 *     onConfirm={() => { dispatch(deleteEmployee(confirm)); setConfirm(null); }}
 *     onCancel={() => setConfirm(null)}
 *   />
 */
export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm animate-slide-up rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {message && <p className="mt-0.5 text-sm text-slate-500">{message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
