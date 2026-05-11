import clsx from 'clsx';

export function InputField({ label, error, className, hint, ...props }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        className={clsx(
          'min-h-10 rounded-lg border bg-white px-3 py-2 text-sm text-ink outline-none transition-all placeholder:text-slate-400',
          'focus:border-brand-400 focus:ring-3 focus:ring-brand-100',
          error ? 'border-red-400 bg-red-50/30 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
      {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
