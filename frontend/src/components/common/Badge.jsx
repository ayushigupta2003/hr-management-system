import clsx from 'clsx';

const variants = {
  // status
  active:   'bg-emerald-50 text-emerald-700 ring-emerald-200',
  inactive: 'bg-slate-100  text-slate-600   ring-slate-200',
  // roles
  admin:    'bg-brand-50   text-brand-700   ring-brand-200',
  hr:       'bg-violet-50  text-violet-700  ring-violet-200',
  employee: 'bg-sky-50     text-sky-700     ring-sky-200',
  // attendance
  present:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  late:     'bg-amber-50   text-amber-700   ring-amber-200',
  absent:   'bg-red-50     text-red-700     ring-red-200',
  leave:    'bg-purple-50  text-purple-700  ring-purple-200',
};

export function Badge({ children, variant = 'inactive' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1',
        variants[variant] ?? variants.inactive,
      )}
    >
      {children}
    </span>
  );
}
