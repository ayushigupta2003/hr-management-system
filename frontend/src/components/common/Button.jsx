import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-sm hover:from-brand-600 hover:to-brand-700 focus:ring-brand-500 active:scale-[0.98]',
  secondary:
    'bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 focus:ring-brand-500 active:scale-[0.98]',
  danger:
    'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700 focus:ring-red-500 active:scale-[0.98]',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-ink focus:ring-brand-500 active:scale-[0.98]',
};

export function Button({ children, className, isLoading = false, variant = 'primary', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
